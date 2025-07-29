import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { Input, Avatar, Segmented } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchCareGivers, 
  getMessages, 
  sendMessage,
  getChatHeads,
  markMessagesAsRead,
  getUnreadMessageCount,
  markChatAsReadOptimistically
} from '../../../redux/doctorSlice';
import { UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import '../../DoctorDashboard/Intercoms/styles.css';
import SendButton from '../../../../assets/images/telegram.png';
import * as signalR from '@microsoft/signalr';

// Memoized user item component to prevent unnecessary re-renders
const UserItem = memo(({ provider, isSelected, onSelect }) => {
  
  return (
    <div
      className={`user-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(provider)}
    >
      <div className="user-avatar">
        <Avatar 
          size={40}
          src={provider.userPicture}
          icon={!provider.userPicture && <UserOutlined />}
          style={{ 
            backgroundColor: !provider.userPicture ? '#00ADEF' : 'transparent',
            color: !provider.userPicture ? '#fff' : undefined
          }}
        >
          {!provider.userPicture && provider.username.charAt(0).toUpperCase()}
        </Avatar>
        {/* Only show indicator if explicitly true AND not currently selected */}
        {provider.newMessage === true && !isSelected && <div className="new-message-indicator" />}
      </div>
      <div className="user-info">
        <div className="user-name-container">
          <span className="user-name">{provider.username}</span>
          {provider.userRole && (
            <small className="user-role">{provider.userRole}</small>
          )}
        </div>
      </div>
    </div>
  );
});

const PatientIntercom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const [signalRConnection, setSignalRConnection] = useState(null);
  const [autoReadStatus, setAutoReadStatus] = useState('');
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const providers = useSelector((state) => state.doctor.careGivers || []);
  const chatHeads = useSelector((state) => state.doctor.chatHeads || []);
  const isLoading = useSelector((state) => state.doctor.chatHeadsLoading);
  const messages = useSelector((state) => state.doctor.messages?.chats);
  const chatRef = useSelector((state) => state.doctor.messages?.chatReference);
  const chatError = useSelector((state) => state.doctor.chatError);
  const authToken = useSelector((state) => state.authentication?.userAuth?.obj?.token);

  // Initialize SignalR connection - matching Doctor Intercom stable implementation
  useEffect(() => {
    if (authToken) {
      console.log('Setting up SignalR connection');
      const connection = new signalR.HubConnectionBuilder()
        .withUrl('https://myfertilitydevapi-prod.azurewebsites.net/chathub', {
          accessTokenFactory: () => authToken,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 20000]) 
        .configureLogging(signalR.LogLevel.Information)
        .build();

      connection.onclose((error) => {
        console.log('SignalR connection closed', error);
      });

      connection.onreconnecting((error) => {
        console.log('SignalR reconnecting', error);
      });

      connection.onreconnected((connectionId) => {
        console.log('SignalR reconnected', connectionId);
        if (selectedUser && chatRef) {
          connection.invoke("JoinChat", chatRef)
            .catch(err => console.error('Error rejoining chat:', err));
        }
      });

      connection.on("ReceiveMessage", async (user, message) => {
        console.log('SignalR: Received message from user:', user);
        
        if (selectedUser?.userRef === user) {
          // If user is actively viewing this chat, automatically mark messages as read
          try {
            setAutoReadStatus('Marking as read...');
            await dispatch(markMessagesAsRead(user));
            // Refresh unread count after marking as read
            await dispatch(getUnreadMessageCount());
            setAutoReadStatus('Marked as read');
            // Clear status after 2 seconds
            setTimeout(() => setAutoReadStatus(''), 2000);
          } catch (error) {
            console.error('Error auto-marking messages as read:', error);
            setAutoReadStatus('Error marking as read');
            setTimeout(() => setAutoReadStatus(''), 3000);
          }
          // Immediately refresh messages for the current chat to show new message
          console.log('SignalR: Immediately refreshing messages for active chat');
          await dispatch(getMessages(user));
          // Don't refresh chat heads for active chat to preserve optimistic update
        } else {
          // If message is from a different user, refresh unread count and chat heads
          dispatch(getUnreadMessageCount());
          // Only refresh chat heads for non-active chats to show new message indicators
          console.log('SignalR: Refreshing chat heads for non-active chat');
          dispatch(getChatHeads()).then(() => {
            console.log('SignalR: Chat heads refreshed successfully');
          }).catch(error => {
            console.error('SignalR: Error refreshing chat heads:', error);
          });
        }
      });

      connection.start()
        .then(() => {
          console.log('SignalR connection started successfully');
          setSignalRConnection(connection);
          // Refresh chat heads when connection is established
          dispatch(getChatHeads()).then(() => {
            console.log('SignalR: Initial chat heads refresh completed');
          });
          if (selectedUser && chatRef) {
            connection.invoke("JoinChat", chatRef)
              .then(() => {
                console.log('Joined chat:', chatRef);
                dispatch(getMessages(selectedUser.userRef || selectedUser.id));
              })
              .catch(err => console.error('Error joining chat:', err));
          }
        })
        .catch(err => {
          console.error('SignalR Connection Error:', err);
          // Try to fall back to long polling if WebSocket fails
          const longPollingConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://myfertilitydevapi-prod.azurewebsites.net/chathub', {
              accessTokenFactory: () => authToken,
              transport: signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect()
            .build();
          
          return longPollingConnection.start()
            .then(() => {
              console.log('SignalR fallback to long polling successful');
              setSignalRConnection(longPollingConnection);
            })
            .catch(err => console.error('SignalR long polling fallback failed:', err));
        });

      return () => {
        console.log('Cleaning up SignalR connection');
        connection.stop()
          .catch(err => console.error('Error stopping SignalR connection:', err));
      };
    }
  }, [authToken, selectedUser, chatRef, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle joining chat rooms when selectedUser or chatRef changes
  useEffect(() => {
    if (signalRConnection && selectedUser && chatRef) {
      signalRConnection.invoke("JoinChat", chatRef)
        .catch(err => console.error('Error joining chat:', err));
    }
  }, [signalRConnection, selectedUser, chatRef]);
  // useEffect(() => {
  //   // Initial fetch
  //   dispatch(getChatHeads());

  //   const interval = setInterval(() => {
  //     dispatch(getChatHeads());
  //   }, 2000); // 2 seconds

    // Cleanup interval on unmount
  //   return () => clearInterval(interval);
  // }, [dispatch]);


  useEffect(() => {
    // Load chat heads first
    dispatch(getChatHeads());

    // Then load all providers for the new message option
    const loadProviders = async () => {
      try {
        const params = {
          page: 1,
          size: 100
        };
        
        const response = await dispatch(fetchCareGivers(params));
        if (!fetchCareGivers.fulfilled.match(response)) {
          console.error('Failed to fetch providers list:', response.error);
        }
      } catch (error) {
        console.error('Error fetching providers list:', error);
      }
    };

    loadProviders();

    // Set up polling interval for chat heads to ensure they stay updated
    const chatHeadsInterval = setInterval(() => {
      dispatch(getChatHeads());
    }, 15000); // Increased to 30 seconds to reduce frequency

    // Cleanup interval on unmount
    return () => clearInterval(chatHeadsInterval);
  }, [dispatch]);

  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser?.userRef || selectedUser?.id) {
      const userId = selectedUser.userRef || selectedUser.id;
      console.log('Fetching messages for user:', userId);
      dispatch(getMessages(userId))
        .then(response => {
          console.log('Messages response:', response);
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });

      // Set up polling interval for messages (only when user is selected)
      const messageInterval = setInterval(() => {
        dispatch(getMessages(userId))
          .catch(error => {
            console.error('Error polling messages:', error);
          });
      }, 20000); // Increased to 20 seconds to reduce frequency

      // Cleanup interval on unmount or when user changes
      return () => clearInterval(messageInterval);
    }
  }, [dispatch, selectedUser]); // Include full selectedUser object to satisfy React Hook rules

  // Combined auto-scroll effect to reduce re-renders
  useEffect(() => {
    if (messagesEndRef.current && messages && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Include full messages array to satisfy React Hook rules

  const handleUserSelect = async (user) => {
    console.log('Selected user:', user);
    setSelectedUser(user);
    
    // Mark messages as read when user is selected (iMessage-like behavior)
    if (user?.userRef || user?.id) {
      const userId = user.userRef || user.id;
      
      // Immediately mark as read optimistically (iMessage-like instant feedback)
      console.log('iMessage-like: Immediately marking chat as read optimistically');
      dispatch(markChatAsReadOptimistically(userId));
      
      try {
        // Mark messages as read via API
        await dispatch(markMessagesAsRead(userId));
        
        // Only refresh unread count, chat heads are already updated optimistically
        await dispatch(getUnreadMessageCount());
        
        console.log('iMessage-like: Messages marked as read successfully');
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleSendMessage = async () => {
    if (message.trim() && selectedUser && chatRef) {
      const userId = selectedUser.userRef || selectedUser.id;
      const trimmedMessage = message.trim();
      
      try {
        setMessage(''); // Clear input immediately for better UX

        // Send through SignalR if connected
        if (signalRConnection) {
          await signalRConnection.invoke("SendMessageToUser", userId, trimmedMessage, chatRef);
        }

        // Also send through API for persistence
        const response = await dispatch(sendMessage({
          userRef: userId,
          chat: trimmedMessage,
          chatRef: chatRef
        }));

        if (sendMessage.fulfilled.match(response)) {
          await dispatch(getMessages(userId));
          // Don't refresh chat heads to preserve optimistic state
        }
      } catch (error) {
        console.error('Error sending message:', error);
        setMessage(trimmedMessage); // Restore message if failed
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const renderMessages = () => {
    if (chatError) {
      return <div className="error-messages">Error loading messages: {chatError.message}</div>;
    }

    if (!messages || messages.length === 0) {
      return <div className="no-messages">No messages yet</div>;
    }

    // Sort messages by date (oldest to newest)
    const sortedMessages = [...messages].sort((a, b) => {
      return new Date(a.createdOn) - new Date(b.createdOn);
    });

    // Group messages by date
    const groupedMessages = [];
    let currentDate = null;

    sortedMessages.forEach((msg, index) => {
      const messageDate = new Date(msg.createdOn);
      const dateString = messageDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Add date header if it's a new date
      if (currentDate !== dateString) {
        currentDate = dateString;
        groupedMessages.push({
          type: 'date-header',
          date: dateString,
          key: `date-${index}`
        });
      }

      // Add message
      groupedMessages.push({
        type: 'message',
        message: msg,
        key: `msg-${index}`
      });
    });

    return groupedMessages.map((item) => {
      if (item.type === 'date-header') {
        return (
          <div key={item.key} className="date-header">
            <span className="date-text">{item.date}</span>
          </div>
        );
      }

      const msg = item.message;
      // Debug: Check the isUser value for each message
      
      // Message is from current user if isUser is true (same logic as doctor-side)
      const messagePosition = msg.isUser ? 'sent' : 'received';
      
      return (
        <div 
          key={item.key} 
          className={`message-bubble ${messagePosition}`}
        >
          <div className="message-content">
            {msg.chat}
            <div className="message-timestamp">
              {new Date(msg.createdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      );
    });
  };

  // Filter providers based on search query - optimized to reduce re-renders
  const filteredProviders = useMemo(() => {
    let users = [];
    
    if (activeTab === 'active') {
      users = chatHeads || [];
    } else {
      // Show all providers
      const providersList = providers?.getRecord || providers || [];
      users = providersList.map(provider => ({
        userRef: provider.userRef || provider.id,
        username: `${provider.firstname || ''} ${provider.lastname || ''}`.trim() || 'Unknown Provider',
        userRole: provider.role || provider.userType,
        userPicture: provider.profilePicture || provider.picture
      }));
    }

    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.username.toLowerCase().includes(query) || 
      (user.userRole && user.userRole.toLowerCase().includes(query))
    );
  }, [searchQuery, activeTab, chatHeads, providers]); // Include full arrays to satisfy React Hook rules

  return (
    <div className="intercom-container">
      <div className={`messages-sidebar ${isMobileView && selectedUser ? 'hidden' : ''}`}>
        <div className="messages-header">
          <h2>MESSAGES</h2>
          <button className="new-message-btn">
            <i className="fas fa-sync-alt"></i> New Message
          </button>
        </div>
        
        <div className="search-container">
          <Input
            prefix={<SearchOutlined style={{ fontSize: '16px' }} />}
            placeholder="Search Providers"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
            allowClear
            bordered={false}
          />
        </div>

        <div className="filter-buttons">
          <Segmented
            value={activeTab}
            onChange={setActiveTab}
            options={[
              {
                label: 'Active ',
                value: 'active'
              },
              {
                label: 'Providers',
                value: 'providers'
              }
            ]}
            block
          />
        </div>

        <div className="users-list">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <UserItem
                key={provider.userRef}
                provider={provider}
                isSelected={selectedUser?.userRef === provider.userRef}
                onSelect={handleUserSelect}
              />
            ))
          ) : (
            <div className="no-results">
              {isLoading ? 'Loading providers...' : `No providers found matching "${searchQuery}"`}
            </div>
          )}
        </div>
      </div>

      <div className={`chat-window ${isMobileView && selectedUser ? 'active' : ''}`}>
        {selectedUser ? (
          <>
            <div className="chat-header">
              {isMobileView && (
                <button className="back-button" onClick={handleBackToList}>
                  <ArrowLeftOutlined />
                </button>
              )}
              <div className="selected-user">
                <Avatar 
                  size={40}
                  src={selectedUser.userPicture}
                  icon={!selectedUser.userPicture && <UserOutlined />}
                  style={{ 
                    backgroundColor: !selectedUser.userPicture ? '#00ADEF' : 'transparent',
                    color: !selectedUser.userPicture ? '#fff' : undefined
                  }}
                >
                  {!selectedUser.userPicture && selectedUser.username.charAt(0).toUpperCase()}
                </Avatar>
                <div className="selected-user-info">
                  <span className="user-name">{selectedUser.username}</span>
                  {selectedUser.userRole && (
                    <small className="text-muted">{selectedUser.userRole}</small>
                  )}
                  {autoReadStatus && (
                    <small style={{ 
                      color: autoReadStatus.includes('Error') ? '#ff4d4f' : '#52c41a',
                      fontSize: '11px',
                      marginTop: '2px'
                    }}>
                      {autoReadStatus}
                    </small>
                  )}
                </div>
              </div>
            </div>
            <div className="chat-messages">
              {renderMessages()}
              <div ref={messagesEndRef} />
            </div>
            <div className="message-input-container">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter message"
                suffix={
                  // <button 
                  //   onClick={handleSendMessage}
                  //   disabled={!message.trim() || chatLoading}
                  //   style={{border: 'none', background: '#fff', borderRadius: '50%'}}
                  // >
                   <img src={SendButton} alt="send" width={50} height={50} onClick={handleSendMessage}/>
                  // </button>
                }
              />
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <h3>How can I help?</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientIntercom;
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Input, Avatar, Segmented, Dropdown, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { 
  patientList as fetchPatientList, 
  fetchCareGivers, 
  getMessages, 
  sendMessage,
  getChatHeads,
  markMessagesAsRead,
  getUnreadMessageCount,
  markChatAsReadOptimistically,
  deleteChat
} from '../../../redux/doctorSlice';
import { UserOutlined, SearchOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './styles.css';
import SendButton from '../../../../assets/images/telegram.png';
import * as signalR from '@microsoft/signalr';

const Intercom = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const [signalRConnection, setSignalRConnection] = useState(null);
  const [autoReadStatus, setAutoReadStatus] = useState('');
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const patients = useSelector((state) => state.doctor.patientList || []);
  const providers = useSelector((state) => state.doctor.careGivers || []);
  const chatHeads = useSelector((state) => state.doctor.chatHeads || []);
  const isLoading = useSelector((state) => state.doctor.chatHeadsLoading);
  const messages = useSelector((state) => state.doctor.messages?.chats);
  const chatRef = useSelector((state) => state.doctor.messages?.chatReference);
  const chatError = useSelector((state) => state.doctor.chatError);
  const authToken = useSelector((state) => state.authentication?.userAuth?.obj?.token);

  // Initialize SignalR connection
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
        console.log('SignalR: Received message from user:', user, 'Message:', message, 'Current selected user:', selectedUser?.userRef);
        
        // Always dispatch getUnreadMessageCount when a new message comes in
        // This ensures the sidebar and other components get updated
        console.log('SignalR: Dispatching getUnreadMessageCount for new message');
        try {
          await dispatch(getUnreadMessageCount());
          console.log('SignalR: getUnreadMessageCount dispatched successfully');
        } catch (error) {
          console.error('SignalR: Error dispatching getUnreadMessageCount:', error);
        }
        
        if (selectedUser?.userRef === user) {
          console.log('SignalR: Message is from currently selected user - auto-marking as read and refreshing messages');
          // If user is actively viewing this chat, automatically mark messages as read
          try {
            setAutoReadStatus('Marking as read...');
            await dispatch(markMessagesAsRead(user));
            // Refresh unread count again after marking as read
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
          console.log('SignalR: Message is from different user - updating chat heads');
          // If message is from a different user, refresh chat heads to show new message indicators
          console.log('SignalR: Refreshing chat heads for non-active chat');
          dispatch(getChatHeads()).then((result) => {
            console.log('SignalR: Chat heads refreshed successfully', result);
          }).catch(error => {
            console.error('SignalR: Error refreshing chat heads:', error);
          });
          dispatch(getUnreadMessageCount()).then(() => {
            console.log('SignalR: Unread count refreshed for non-active chat');
          }).catch(error => {
            console.error('SignalR: Error refreshing unread count:', error);
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
          dispatch(getUnreadMessageCount()).then(() => {
            console.log('SignalR: Initial unread count refresh completed');
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

  useEffect(() => {
    // Load chat heads first
    dispatch(getChatHeads());
    dispatch(getUnreadMessageCount());

    const loadUsers = async () => {
      try {
        const params = {
          page: 0,
          size: 500
        };
        
        if (activeTab === 'patients') {
          await dispatch(fetchPatientList(params));
        } else if (activeTab === 'providers') {
          await dispatch(fetchCareGivers(params));
        }
      } catch (error) {
        console.error('Error fetching users list:', error);
      }
    };

    if (activeTab !== 'active') {
      loadUsers();
    }

    // Set up polling interval for chat heads to ensure they stay updated
    const chatHeadsInterval = setInterval(() => {
      dispatch(getChatHeads());
      dispatch(getUnreadMessageCount());
    }, 15000); // Increased to 15 seconds to reduce frequency

    // Cleanup interval on unmount
    return () => clearInterval(chatHeadsInterval);
  }, [dispatch, activeTab]);

  // Filter users based on search query and active tab - optimized to reduce re-renders
  const filteredUsers = useMemo(() => {
    let users = [];
    
    switch(activeTab) {
      case 'active':
        users = chatHeads || [];
        console.log('Chat heads data:', chatHeads);
        break;
      case 'patients':
        users = (patients || []).map(patient => ({
          userRef: patient.userRef,
          username: `${patient.firstname} ${patient.lastname}`,
          userPicture: patient.picture,
          userRole: 'Patient'
        }));
        break;
      case 'providers':
        const providersList = providers?.getRecord || providers || [];
        users = providersList.map(provider => ({
          userRef: provider.userRef || provider.id,
          username: `${provider.firstname || ''} ${provider.lastname || ''}`.trim() || 'Unknown Provider',
          userRole: provider.role || provider.userType,
          userPicture: provider.profilePicture || provider.picture
        }));
        break;
      default:
        users = [];
    }

    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(user => 
      user.username.toLowerCase().includes(query) || 
      (user.userRole && user.userRole.toLowerCase().includes(query))
    );
  }, [searchQuery, activeTab, chatHeads, patients, providers]); // Include full arrays to satisfy React Hook rules

  // Modified handleSendMessage to use SignalR
  const handleSendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    if (!selectedUser) {
      console.error('No user selected');
      return;
    }

    const userId = selectedUser.userRef || selectedUser.id;
    const trimmedMessage = message.trim();

    try {
      // Clear input immediately for better UX
      setMessage('');

      // Send through API first
      const response = await dispatch(sendMessage({
        userRef: userId,
        chat: trimmedMessage,
        chatRef: chatRef
      })).unwrap();

      console.log('Send message response:', response);

      // Immediately update messages to show the sent message
      // Don't set initialLoad here since we're just updating
      await dispatch(getMessages(userId));
      // Don't refresh chat heads to preserve optimistic state

      // Try SignalR if available
      if (signalRConnection?.connectionStarted) {
        try {
          await signalRConnection.invoke("SendMessageToUser", userId, trimmedMessage, chatRef);
          console.log('Message sent via SignalR successfully');
        } catch (signalRError) {
          console.error('SignalR send error:', signalRError);
        }
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      // Restore the message if sending failed
      setMessage(trimmedMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      console.log('Enter pressed, attempting to send message');
      handleSendMessage();
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedUser(null);
    setSearchQuery(''); // Clear search when switching tabs
    
    // Refresh data when switching tabs
    if (tab === 'active') {
      dispatch(getChatHeads());
      dispatch(getUnreadMessageCount());
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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
        // Don't refresh chat heads on error to preserve optimistic state
      }
    }
    
    // Get messages for the selected user to establish chat reference
    try {
      const userId = user.userRef || user.id;
      console.log('Fetching messages for user:', userId);
      
      const response = await dispatch(getMessages(userId));
      if (getMessages.fulfilled.match(response)) {
        console.log('Messages fetched successfully:', response.payload);
      } else {
        console.error('Failed to fetch messages:', response.error);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Load messages when a user is selected and set up polling
  useEffect(() => {
    if (selectedUser?.userRef || selectedUser?.id) {
      const userId = selectedUser.userRef || selectedUser.id;
      console.log('Setting up message polling for user:', userId);
      
      // Set up polling interval for messages (only when user is selected)
      const messageInterval = setInterval(() => {
        console.log('Polling messages for user:', userId);
        dispatch(getMessages(userId))
          .catch(error => {
            console.error('Error polling messages:', error);
          });
      }, 20000); // 20 seconds to avoid conflicts with SignalR

      // Cleanup interval on unmount or when user changes
      return () => {
        clearInterval(messageInterval);
      };
    }
  }, [dispatch, selectedUser]); // Include full selectedUser object to satisfy React Hook rules

  // Add effect to handle chat reference updates
  useEffect(() => {
    if (selectedUser && !chatRef) {
      const userId = selectedUser.userRef || selectedUser.id;
      dispatch(getMessages(userId))
        .catch(error => console.error('Error fetching messages:', error));
    }
  }, [selectedUser, chatRef, dispatch]);

  // Combined auto-scroll effect to reduce re-renders
  useEffect(() => {
    if (messagesEndRef.current && messages && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]); // Include full messages array to satisfy React Hook rules

  const handleBackToList = () => {
    setSelectedUser(null);
  };

  const handleOptionsClick = (e, userRef) => {
    e.stopPropagation();
  };

  const handleDeleteChat = async (userRef) => {
    console.log('Delete chat for user:', userRef);
    
    // Find the user info for the confirmation dialog
    const user = filteredUsers.find(u => u.userRef === userRef);
    const userName = user?.username || 'this user';
    
    Modal.confirm({
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="delete-icon-container">
            <DeleteOutlined className="delete-icon" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#262626' }}>
            Delete Chat
          </span>
        </div>
      ),
      content: (
        <div style={{ padding: '16px 0' }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#595959', 
            lineHeight: '1.6',
            margin: '0 0 16px 0'
          }}>
            Are you sure you want to delete the chat with{' '}
            <span style={{ fontWeight: '600', color: '#262626' }}>{userName}</span>?
          </p>
          <div className="delete-warning">
            <p style={{ 
              fontSize: '13px', 
              color: '#cf1322', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '14px' }}>⚠️</span>
              This action cannot be undone. All messages will be permanently deleted.
            </p>
          </div>
        </div>
      ),
      okText: 'Delete Chat',
      okType: 'danger',
      cancelText: 'Cancel',
      width: 480,
      centered: true,
      okButtonProps: {
        style: {
          backgroundColor: '#ff4d4f',
          borderColor: '#ff4d4f',
          borderRadius: '6px',
          height: '36px',
          fontWeight: '500'
        }
      },
      cancelButtonProps: {
        style: {
          borderRadius: '6px',
          height: '36px',
          fontWeight: '500'
        }
      },
      onOk: async () => {
        try {
          console.log('chatRef', chatRef);
          // Find the chat reference for this user
          // const chatHead = chatHeads.find(chat => chat.userRef === userRef);
          // if (!chatHead?.chatRef) {
          //   console.error('No chat reference found for user:', userRef);
          //   toast.error('Chat reference not found');
          //   return;
          // }

          // Call the delete API
          const response = await dispatch(deleteChat(chatRef)).unwrap();
          console.log('Chat deleted successfully:', response);

          await dispatch(getChatHeads());
          await dispatch(getUnreadMessageCount());

          if (selectedUser?.userRef === userRef) {
            setSelectedUser(null);
          }

          toast.success('Chat deleted successfully');
        } catch (error) {

          console.log('Error deleting chat:', error);
          // Show error message
          toast.error('Failed to delete chat. Please try again.');
        }
      },
    });
  };

  // Create dropdown menu items
  const getDropdownItems = (userRef) => [
    {
      key: 'delete',
      label: (
        <div className="dropdown-item">
          <DeleteOutlined style={{ color: '#ff4d4f' }} />
          <span style={{ color: '#ff4d4f' }}>Delete Chat</span>
        </div>
      ),
      onClick: () => handleDeleteChat(userRef),
    },
  ];

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
      // Message is from current user if isUser is true (since we're the doctor)
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

  return (
    <div className="intercom-container">
      <div className={`messages-sidebar ${isMobileView && selectedUser ? 'hidden' : ''}`}>
                  <div className="messages-header">
            <h2>MESSAGES</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* <div style={{ 
                fontSize: '10px', 
                padding: '2px 6px', 
                borderRadius: '8px', 
                background: connectionStatus === 'connected' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                color: connectionStatus === 'connected' ? '#fff' : '#f44336'
              }}>
                {connectionStatus}
              </div> */}
           
            </div>
          </div>
        
        <div className="search-container">
          <Input
            prefix={<SearchOutlined style={{ fontSize: '16px' }} />}
            placeholder="Search chats"
            className="search-input"
            value={searchQuery}
            onChange={handleSearch}
            allowClear
            bordered={false}
          />
          <div className="filter-buttons">
            <Segmented
              value={activeTab}
              onChange={handleTabChange}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Patients', value: 'patients' },
                { label: 'Providers', value: 'providers' }
              ]}
            />
          </div>
        </div>

        <div className="users-list">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.userRef}
                className={`user-item ${selectedUser?.userRef === user.userRef ? 'selected' : ''}`}
                onClick={() => handleUserSelect(user)}
                data-user-ref={user.userRef}
              >
                <div className="user-avatar">
                  <Avatar 
                    size={40}
                    src={user.userPicture}
                    icon={!user.userPicture && <UserOutlined />}
                    style={{ 
                      backgroundColor: !user.userPicture ? '#00ADEF' : 'transparent',
                      color: !user.userPicture ? '#fff' : undefined
                    }}
                  >
                    {!user.userPicture && user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  {(user.newMessage === true || user.hasUnreadMessages === true || user.unreadCount > 0) && selectedUser?.userRef !== user.userRef && (
                    <div className="new-message-indicator" />
                  )}
                 
                </div>
                <div className="user-info">
                  <div className="user-name-container">
                    <span className="user-name">{user.username}</span>
                    {user.userRole && (
                      <small className="user-role">{user.userRole}</small>
                    )}
                  </div>
                </div>
                <div className="chat-options">
                  <Dropdown
                    menu={{ items: getDropdownItems(user.userRef) }}
                    trigger={['click']}
                    placement="bottomRight"
                    overlayStyle={{ minWidth: '140px' }}
                  >
                    <button 
                      className="options-button"
                      onClick={(e) => handleOptionsClick(e, user.userRef)}
                    >
                      <EllipsisOutlined />
                    </button>
                  </Dropdown>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              {isLoading ? `Loading ${activeTab === 'active' ? 'chats' : activeTab === 'patients' ? 'patients' : 'providers'}...` : `No ${activeTab === 'active' ? 'active chats' : activeTab === 'patients' ? 'patients' : 'providers'} found matching "${searchQuery}"`}
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
                  <div 
                    onClick={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    style={{ 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '5px'
                    }}
                  >
                    <img 
                      src={SendButton} 
                      alt="send" 
                      width={40} 
                      height={40} 
                      style={{
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                }
              />
            </div>
          </>
        ) : (
          <div className="no-chat-selected">
            <div className="welcome-message">
              <h3>Select a chat to start messaging</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Intercom;
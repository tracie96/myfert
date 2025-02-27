import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { gapi } from 'gapi-script';
import { Base64 } from 'js-base64';
import moment from "moment";
import { Input, List, Pagination, Select, Menu, Popover, Tag } from "antd";
// import HiddenInfo from "./HiddenInfo";
import SetUserPassword from "./SetUserPassword";
import ChangeEmail from "./ChangeEmail";
// import ReviewApplication from "./ReviewApplication";
import { handleApiError } from "../Handler/ExceptionHandler";
import CustomModal from "../global_component/CustomModal";
import { baseUrl } from "../../utils/envAccess";

const AdminInbox = () => {

  const GMAIL_CLIENT_ID = process.env.REACT_APP_GMAIL_CLIENT_ID;
  const GMAIL_API_KEY = process.env.REACT_APP_GMAIL_API_KEY;
  const USER_EMAIL = 'email.test.harker@gmail.com'; // Modify to the MFL email address
  const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.modify';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userAuth = useSelector(
    (state) => state?.authentication?.userAuth
  );
  const [threads, setThreads] = useState([]); // List of threads from Gmail API
  const [currentThreads, setCurrentThreads] = useState([]); // Threads shown on the sidebar
  const [selectedThread, setSelectedThread] = useState({}); // Thread shown in the main box
  const [threadFilter, setThreadFilter] = useState('ALL'); 
  const [reply, setReply] = useState("");
  const [selectedLabel, setSelectedLabel] = useState('');
  const [gPage, setGPage] = useState(1); // Pagination page
  const [gPageSize, setGPageSize] = useState(10); // Pagination page size
  const [clientUser, setClientUser] = useState({}); // Corresponding user in the MFL backend
  const [modalOpen, setModalOpen] = useState('');
  const [popOpen, setPopOpen] = useState(false);

  // ================== GMAIL Authentication ==================

  const handleAuthClick = () => {
    try {
      gapi.auth2.getAuthInstance().signIn();
    } catch (error) {
      handleApiError(error);
    }
  };
  const updateSigninStatus = (callback) => {
    return (isSignedIn) => {
      setIsAuthenticated(isSignedIn);
      if (isSignedIn) {
        fetchThreads();
      }
      callback(isSignedIn); 
    };
  };
  

  useEffect( () => {
    const initClient = () => {
      gapi.client.init({
        apiKey: GMAIL_API_KEY,
        clientId: GMAIL_CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
        scope: SCOPES,
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      }).catch(handleApiError);
    };

    gapi.load('client:auth2', initClient);
    
  }, [GMAIL_API_KEY, GMAIL_CLIENT_ID,updateSigninStatus]);

  useEffect( () => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        try {
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        } catch (error) {
          handleApiError(error);
        }
      }, 5000);
      return () => clearInterval(interval)
    }
    
  }, [isAuthenticated, threadFilter]);

  // ================== GMAIL Data Retreival ==================

  const fetchThreads = () => {
    const q = threadFilter === 'NEW' ? ' -label:Resolved -label:In-Progress' : ''
    gapi.client.gmail.users.threads.list({
      userId: 'me',
      q: `to: me${q}`,
      labelIds: threadFilter === 'ALL' || threadFilter === 'NEW' ? [] : [threadFilter],
      maxResults: 50, // Check the api usage limits if adjusting: https://developers.google.com/gmail/api/reference/quota
    }).then((response) => {
      setThreads(response.result?.threads);
    }).catch(handleApiError);
  };

  const processThread = ({res}) => {
    // res: One thread object from the Gmail API
    // returns: a decoded and organized thread object
    //  - threadId: String. the id of the thread
    //  - sender: String. the email of the sender
    //  - subject: String. the subject of the email
    //  - inProgress: Boolean. if the thread has the in progress label
    //  - resolved: Boolean. if the thread has the resolved label
    //  - messages: Array. the message objects:
    //    - sender: String. the email of the sender
    //    - messageId: String. the gmail id of the message
    //    - references: String. The list of message ids that this message is in reply to seperated by spaces
    //    - body: String. the body of the message decoded
    //    - unread: Boolean. if the message is unread
    //    - timestamp: Moment. the timestamp of the message
    const threadMessages = res.result.messages
    let sender;
    for (var i=0; i < threadMessages.length; i++) {
      // Find the first message that is not from the user, grab that as the sender.
      let messageFrom = threadMessages[i].payload.headers.find((o) => o.name === 'From').value
      messageFrom = messageFrom.indexOf('<') > -1 ? messageFrom.slice(messageFrom.indexOf('<') + 1, messageFrom.indexOf('>')) : messageFrom
      if (messageFrom !== USER_EMAIL) {
        sender = messageFrom;
        break;
      };
    }
    return {
      threadId: threadMessages[0].threadId,
      sender,
      subject: threadMessages[0].payload.headers.find((o) => o.name === 'Subject').value,
      inProgress: threadMessages[0].labelIds.includes('Label_3014460817866314805'),
      resolved: threadMessages[0].labelIds.includes('Label_2423276085954350356'),
      messages: threadMessages.map((message) => {
        const sender = message.payload.headers.find((o) => o.name === 'From').value;
        const bodyEncoded = message.payload.parts? message.payload.parts[0].body.data : message.payload.body.data;
        const decodedBody = bodyEncoded ? Base64.decode( bodyEncoded.replace(/-/g, '+').replace(/_/g, '/') ) : '';

        // Finds part of message that is auto-generated when someone replies and cuts it out.
        // Ex: On Mon, Jun 21, 2021 at 12:00 PM, <email> wrote:
        const replyIndex = decodedBody.search(/\r\nOn [A-Z][a-z]{2}, [A-Z][a-z]{2} \d{1,2}, \d{4} at \d{1,2}:\d{2}.[A-Z]M[a-zA-Z ]*<(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])>\r?\n? ?wrote:\r\n\r\n>/);
        const body = replyIndex > -1 ? decodedBody.slice(0, replyIndex) : decodedBody;

        return {
          sender: sender.indexOf('<') > -1 ? sender.slice(sender.indexOf('<') + 1, sender.indexOf('>')) : sender,
          messageId: message.payload.headers.find((m) => m.name === 'Message-ID' || m.name === 'Message-Id').value,
          references: message.payload.headers.find((m) => m.name === 'References')?.value,
          body,
          unread: message.labelIds.includes('UNREAD'),
          timestamp: moment( message.payload.headers.find((m) => m.name === 'Date').value, "ddd, DD MMM YYYY HH:mm:ss Z" )
        }
      })
    }
  }

  const loadPages = (page=gPage, pageSize=gPageSize) => {
    setGPage(page);
    setGPageSize(pageSize);

    // Need to give an empty array if no threads found.
    let trueThreads = threads;
    if (!threads) { trueThreads = [] }
    const threadPromises = trueThreads.slice((page - 1)*pageSize, page*pageSize).map((msg) =>
      gapi.client.gmail.users.threads.get({
        userId: 'me',
        id: msg.id,
      })
    );

    Promise.all(threadPromises).then((responses) => {
      const threadDetails = responses.map((res) => {
        const thread = processThread({res});

        // If there is a new message it won't be marked with an in progress or resolved label.
        // So if an in progress or resolved thread gets past the NEW filter, add the labels again.
        if (threadFilter === 'NEW' && (thread.inProgress || thread.resolved))
          gapi.client.gmail.users.threads.modify({
            'userId': 'me', 
            'id': selectedThread.threadId,
            'addLabelIds': [thread.inProgress ? 'Label_3014460817866314805' : 'Label_2423276085954350356'],
          }).then().catch(handleApiError);

        return thread;
      })
        // Filter out in progress and resolved threads that snuck through
        .filter((o) => threadFilter === 'NEW' ? !o.inProgress && !o.resolved : true);
      setCurrentThreads(threadDetails);
    });
  }

  useEffect( () => {
    // Whenever the list of threads is updated, grab their details.
    loadPages();
  }, [threads] );

  useEffect( () => {
    // Updates current selected thread every second.
    // Check the api usage limits if adjusting: https://developers.google.com/gmail/api/reference/quota
    if (selectedThread?.threadId) {
      const interval = setInterval(() => {
        gapi.client.gmail.users.threads.get({
          userId: 'me',
          id: selectedThread.threadId,
        }).then((response) => {
          const thread = processThread({res: response});
          // Prevents the async callback from changing the selected thread back to what it was before the user selected it.
          // Fixes stuttering issue where the selected thread would change back to the previous thread.
          setSelectedThread((currentThread) => currentThread.threadId === thread.threadId ? thread : currentThread);
        }).catch(handleApiError);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [selectedThread]);

  // ================== GMAIL Data Modification ==================

  const sendEmail = () => {
    const endMessage = selectedThread.messages[selectedThread.messages.length - 1]
    const email = 
      `From: <${USER_EMAIL}>\r\n` +
      `To: ${selectedThread.sender}\r\n` +
      `Subject: ${selectedThread.subject}\r\n` +
      `In-Reply-To: ${endMessage.messageId}\r\n` + 
      `References: ${endMessage.references ? endMessage.references : ""} ${endMessage.messageId}\r\n` +
      `\r\n` +
      reply

    const encodedEmail = Base64.encode(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    gapi.client.gmail.users.messages.send({userId: 'me', raw: encodedEmail, threadId: selectedThread.threadId}).then().catch(handleApiError);
  }

  const markAsRead = ({thread}) => {
    gapi.client.gmail.users.threads.modify({'userId': 'me', 'id': thread.threadId, 'removeLabelIds': ['UNREAD'],})
      .then().catch(handleApiError);
  }

  // ================== My Fertility Labs Backend Calls ==================

  const findUser = ({thread}) => {
    const list = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${userAuth?.obj?.token}`,
        },
      }
      try {
        const responseDoc = await axios(`${baseUrl}Admin/GetCareGiverList/0/50`, config);
        const responsePat = await axios(`${baseUrl}Admin/GetPatientList/0/100`, config);
        return [responseDoc.data, responsePat.data]
      } catch (error) {
        handleApiError(error);
        return [];
      }
    }

    list().then((res) => {
      const user = res[0].find((u) => u.email === thread.sender) || res[1].find((u) => u.email === thread.sender);
      setClientUser(user || {});
    });
  }

  const ContentMenu = () => {
    const cleanup = () => {
      setPopOpen(false);
    }
    return <Menu
      mode="inline"
      items={[
        { key: 'application', label: "Review Application", onClick: () => { cleanup(); setModalOpen('Application'); } },
        { key: 'password', label: "Reset Password", onClick: () => { cleanup(); setModalOpen('Password'); } },
        { key: 'switch', label: "Change Email", onClick: () => { cleanup(); setModalOpen('Email'); } },
      ]}
    />
  }

  // ================== Layout ==================
  return (
    // Big box
    <div style={{margin: '0.5vw', display: 'flex', flexDirection: 'column'}}>
      {/* Pagination */}
      <div style={{display: 'flex'}}>
        <Pagination
          total={threads.length}
          onChange={loadPages}
        />
        <Select 
          style={{width: '8em'}}
          onChange={(value) => {
            setThreadFilter(value);
          }}
          defaultValue={'ALL'}
          options={[
            {value: 'ALL', label: 'All'}, 
            {value: 'NEW', label: 'New'}, 
            {value: 'Label_3014460817866314805', label: 'In Progress'}, 
            {value: 'Label_2423276085954350356', label: 'Resolved'},
          ]}
        />
      </div>
      {/* Inboxes */}
      <div style={{display: 'flex'}}>
        {/* List of Threads */}
        <List
          dataSource={currentThreads}
          className="inbox-big-div"
          style={{width: '20vw', overflow: 'auto'}}
          renderItem={(item, index) => {
            return (
              <List.Item 
                className={`inbox-list-item ${ item.threadId === selectedThread.threadId ? "inbox-selected-item" : item.messages.filter((o) => o.unread).length < 1 ? "inbox-read-item" : ""}`}
                onClick={() => {
                  setSelectedThread( item )
                  setSelectedLabel(item?.inProgress ? 'Label_3014460817866314805' : item?.resolved ? 'Label_2423276085954350356' : '');
                  
                  markAsRead({thread: item});
                  findUser({thread: item});
                }}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', minWidth: '100%'}}>
                  <p>
                    { item.sender }
                  </p>
                  <Tag style={{height: 'fit-content'}}>{item.inProgress ? "In Progress" : item.resolved ? "Resolved" : "New"}</Tag>
                </div>
                <h5>
                  { item.subject }
                </h5>
                <p>
                  { item.messages[0].body.length > 30 ? `${item.messages[0].body.slice(0,30)}...` : item.messages[0].body }
                </p>
              </List.Item>
            )
          }}
        />
      
        {/* Selected Thread */}
        <div className="inbox-big-div" style={{ display: 'flex', flexDirection: 'column', width: '45vw', marginLeft: '2vw', }}>
          {/* Buttons and Selections */}
          <div className="inbox-content-div inbox-bottom-border" style={{ justifyContent: 'flex-end' }}>
            <h5 style={{marginLeft: '10px'}}>Status: </h5>
            <Select
              style={{marginLeft: '10px', minWidth: '10em'}}
              value={selectedLabel}
              onChange={(value) => {
                setSelectedLabel(value);
                gapi.client.gmail.users.threads.modify({
                  'userId': 'me', 
                  'id': selectedThread.threadId, 
                  'addLabelIds': value ? [value] : [],
                  'removeLabelIds': ['Label_3014460817866314805', 'Label_2423276085954350356'].filter((o) => o !== value)
                }).then().catch(handleApiError);
              }}
              options={[
                {value: '', label: 'New'},
                {value: 'Label_3014460817866314805', label: 'In Progress'}, 
                {value: 'Label_2423276085954350356', label: 'Resolved'},
              ]}
            />
            <Popover 
              placement="rightTop" 
              content={<ContentMenu/>} 
              trigger='click'
              open={popOpen}
              onOpenChange={ 
                (newOpen) => { 
                  if (newOpen && Object.keys(clientUser).length <= 0) setModalOpen('notfound')
                  else setPopOpen(newOpen);
                  
                } 
              }
            >
              <button 
                className="btn btn-primary"
                style={{ background: "#01ACEE" }} 
              >
                Actions
              </button>
            </Popover>
            <button 
              className="btn btn-secondary"
              style={{marginLeft: '10px'}}
              onClick={handleAuthClick}
            >
              Sign In
            </button>
          </div>
          {/* Sender's Email */}
          <div className="inbox-content-div">
            <h5 style={{color: 'black'}}>{ selectedThread.sender }</h5>
          </div>
          {/* User Information */}
          <div className="inbox-content-div inbox-bottom-border" style={{ flexWrap: 'wrap', columnGap: '20px' }}>
            {/* <HiddenInfo label='Account #' value={clientUser?.userId || 'not found'}/>
            <HiddenInfo label='First Name' value={clientUser?.firstname || 'not found'}/>
            <HiddenInfo label='Last Name' value={clientUser?.lastname || 'not found'}/>
            <HiddenInfo label='Date of Birth' value={clientUser?.dob || 'not found'}/> */}
          </div>
          {/* Email Subject */}
          <div className="inbox-content-div inbox-bottom-border">
            <h4 style={{color: 'black'}}>{ selectedThread.subject }</h4>
          </div>
          {/* Email Messages */}
          <List
            dataSource={selectedThread.messages}
            style={{overflow: 'auto'}}
            renderItem={(item, index) => {
              return (
                <List.Item 
                  className={`inbox-list-item ${ item.sender === USER_EMAIL ? "inbox-selected-item" : ""}`}
                >
                  <p style={{marginLeft: 'auto'}}>
                    {item.timestamp.format("MMMM Do YYYY, h:mm a")}
                  </p>
                  <p>
                    {item.body}
                  </p>
                </List.Item>
              )
            }}
          />
          {/* Reply Inbox and button */}
          <div style={{ display: 'flex', backgroundColor: '#E2E8F0', margin: 'auto 10px 10px 10px', borderRadius: '10px' }}>
            <Input 
              placeholder="Reply..." 
              variant="borderless" 
              value={reply} 
              onChange={(e) => {
                setReply(e.target.value)
              }}
            />
            <button
              onClick={() => {
                sendEmail();
                setReply("");
              }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      {/* Error Modal */}
      {
        Object.keys(clientUser).length > 0 ? 
        [
          <SetUserPassword
            isOpen={modalOpen}
            setOpen={setModalOpen}
            account={clientUser?.userId || clientUser?.id}
          />,
          <ChangeEmail
            isOpen={modalOpen}
            setOpen={setModalOpen}
            account={clientUser?.userId || clientUser?.id}
          />,
        //   <ReviewApplication
        //     isOpen={modalOpen}
        //     setOpen={setModalOpen}
        //     updateTable={false}
        //     setUpdateTable={() => {}}
        //     userInfo={clientUser}
        //   />
        ] :
          <CustomModal
            show={modalOpen === 'notfound'}
            onHide={() => setModalOpen('')}
            size="md"
            title={`User Not Found`}
            body={"No user connected to this email address exists."}
          />
      
      }
    </div>
  )
}

export default AdminInbox;
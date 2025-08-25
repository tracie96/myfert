import * as signalR from '@microsoft/signalr';

class GlobalSignalRService {
  constructor() {
    this.connection = null;
    this.listeners = new Set();
    this.isConnected = false;
  }

  // Initialize the SignalR connection
  async initialize(authToken) {
    if (this.connection && this.isConnected) {
      return this.connection;
    }

    try {
      console.log('Initializing global SignalR connection');
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl('https://myfertilitydevapi-prod.azurewebsites.net/chathub', {
          accessTokenFactory: () => authToken,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Set up connection event handlers
      this.connection.onclose((error) => {
        console.log('Global SignalR connection closed', error);
        this.isConnected = false;
        this.notifyListeners('connectionClosed', error);
      });

      this.connection.onreconnecting((error) => {
        console.log('Global SignalR reconnecting', error);
        this.notifyListeners('reconnecting', error);
      });

      this.connection.onreconnected((connectionId) => {
        console.log('Global SignalR reconnected', connectionId);
        this.isConnected = true;
        this.notifyListeners('reconnected', connectionId);
      });

      // Set up message handler
      this.connection.on("ReceiveMessage", (user, message) => {
        console.log('Global SignalR: Received message from user:', user, 'Message:', message);
        this.notifyListeners('newMessage', { user, message });
      });

      // Start the connection
      await this.connection.start();
      this.isConnected = true;
      console.log('Global SignalR connection started successfully');
      
      return this.connection;
    } catch (error) {
      console.error('Global SignalR Connection Error:', error);
      
      // Try fallback to long polling
      try {
        const longPollingConnection = new signalR.HubConnectionBuilder()
          .withUrl('https://myfertilitydevapi-prod.azurewebsites.net/chathub', {
            accessTokenFactory: () => authToken,
            transport: signalR.HttpTransportType.LongPolling
          })
          .withAutomaticReconnect()
          .build();

        await longPollingConnection.start();
        this.connection = longPollingConnection;
        this.isConnected = true;
        console.log('Global SignalR fallback to long polling successful');
        
        return this.connection;
      } catch (fallbackError) {
        console.error('Global SignalR long polling fallback failed:', fallbackError);
        throw fallbackError;
      }
    }
  }

  // Add a listener for SignalR events
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // Return unsubscribe function
  }

  // Notify all listeners
  notifyListeners(eventType, data) {
    this.listeners.forEach(callback => {
      try {
        callback(eventType, data);
      } catch (error) {
        console.error('Error in SignalR listener callback:', error);
      }
    });
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      connection: this.connection
    };
  }

  // Stop the connection
  async stop() {
    if (this.connection) {
      try {
        await this.connection.stop();
        this.isConnected = false;
        console.log('Global SignalR connection stopped');
      } catch (error) {
        console.error('Error stopping global SignalR connection:', error);
      }
    }
  }
}

// Create a singleton instance
const globalSignalRService = new GlobalSignalRService();
export default globalSignalRService; 
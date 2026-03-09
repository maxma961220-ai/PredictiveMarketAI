// ethers v5 version
import { ethers } from 'ethers';
import axios from 'axios';

/**
 * Get API base URL, using the current page's IP address
 * @returns {string} API base URL
 */
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  return `http://192.168.12.72:8000`;
};

// Contract address configuration
const CONTRACT_ADDRESSES = {
  predictionMarket: '0x*****************************************2' // Monad testnet contract address
};

// Prediction market contract ABI
const PREDICTION_MARKET_ABI = [
  "function agentCount() external view returns (uint256)",
  "function predictionCount() external view returns (uint256)",
  "function getAgent(uint256 _agentId) external view returns (uint256 id, string memory name, string memory title, string memory domain, uint256 totalPredictions, uint256 correctPredictions, uint256 hitRate, bool[] memory recentPerformance, uint256[] memory predictIds)",
  "function getPrediction(uint256 _predictId) external view returns (uint256 id, uint256 eventId, uint256 agentId, string predictResult, uint256 predictProbability, string memory ipfsHash, bool isCorrect)",
  "function getAgentsByDomain(string memory) external view returns (uint256[] memory)",
  "function getAllAgentIds() public view returns (uint256[] memory)",
  "function getEventPredictions(uint256 _eventId) external view returns (uint256[] memory)",
  "function getAgentPredictions(uint256 _agentId) external view returns (uint256[] memory)",
  "function payFee() external payable",
  "event FeePaid(address indexed payer, uint256 amount)"
];

/**
 * Ethereum Service class
 * Provides common methods for Ethereum blockchain interaction
 */
class EthereumService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
  }

  /**
   * Initialize Ethereum service
   * @returns {Promise<void>}
   */
  async init() {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask or another Ethereum wallet first');
    }
    
    // v5 syntax: using Web3Provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Get signer (v5 doesn't need await)
    this.signer = this.provider.getSigner();
    
    // Initialize contract instances
    this.contracts = await this.initContracts();
  }

  /**
   * Initialize contract instances
   * @returns {Promise<Object>}
   */
  async initContracts() {
    if (!this.signer) {
      throw new Error('Signer not initialized. Please call init() first');
    }
    return {
      predictionMarket: new ethers.Contract(
        CONTRACT_ADDRESSES.predictionMarket,
        PREDICTION_MARKET_ABI,
        this.signer
      )
    };
  }

  /**
   * Get single event information
   * @param {number} eventId - Event ID
   * @returns {Promise<Object>}
   */
  async getEvent(eventId) {
    try {
      // Call local service to get event information
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(`${apiBaseUrl}/api/events?id=${eventId}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      return response.data;
    } catch (error) {
      console.error('Local service call failed:', error.message);
      throw error;
    }
  }

  /**
   * Get single AI digital human information
   * @param {number} agentId - AI digital human ID
   * @returns {Promise<Object>}
   */
  async getAgent(agentId) {
    if (!this.contracts.predictionMarket) {
      await this.init();
    }
    try {
      // v5 call contract function
      const agent = await this.contracts.predictionMarket.getAgent(agentId);
      // Parse returned data (v5 returns array)
      return {
        id: agent.id.toString(),
        name: agent.name,
        title: agent.title,
        domain: agent.domain,
        totalPredictions: agent.totalPredictions.toString(),
        correctPredictions: agent.correctPredictions.toString(),
        hitRate: agent.hitRate.toString(),
        recentPerformance: agent.recentPerformance,
        predictIds: agent.predictIds.map(id => parseInt(id.toString()))
      };
    } catch (error) {
      console.error('Contract call failed:', error.message);
      throw error;
    }
  }

  /**
   * Get prediction details from IPFS
   * @param {string} ipfsHash - IPFS hash
   * @returns {Promise<Object>}
   */
  async getPredictionDetailsFromIPFS(ipfsHash) {
    try {
      const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      const response = await axios.get(url);
      return {
        reason: response.data.reason || '',
        coreConclusion: response.data.core_conclusion || ''
      };
    } catch (error) {
      console.error('Failed to get data from IPFS:', error.message);
      // If IPFS request fails, return empty values
      return {
        reason: '',
        coreConclusion: ''
      };
    }
  }

  /**
   * Get single prediction information
   * @param {number} predictId - Prediction ID
   * @returns {Promise<Object>}
   */
  async getPrediction(predictId) {
    if (!this.contracts.predictionMarket) {
      await this.init();
    }

    try {
      const prediction = await this.contracts.predictionMarket.getPrediction(predictId);
      
      // Get details from IPFS
      const details = await this.getPredictionDetailsFromIPFS(prediction.ipfsHash);
      
      // Parse returned data (v5 returns array)
      return {
        id: prediction.id.toString(),
        eventId: prediction.eventId.toString(),
        agentId: prediction.agentId.toString(),
        predictResult: prediction.predictResult,
        predictProbability: prediction.predictProbability.toString(),
        ipfsHash: prediction.ipfsHash,
        reason: details.reason,
        coreConclusion: details.coreConclusion,
        isCorrect: prediction.isCorrect
      };
    } catch (error) {
      console.error('Contract call failed:', error.message);
      throw error;
    }
  }

  /**
   * Get event list
   * @param {string} domain - Event domain (optional)
   * @param {number} status - Event status (optional)
   * @returns {Promise<Array<Object>>}
   */
  async getEvents(domain, status) {
    try {
      // Build query parameters
      const params = {};
      if (domain) params.domain = domain;
      if (status !== undefined) params.status = status;
      
      // Call local service to get event list
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(`${apiBaseUrl}/api/events`, {
        params,
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      return response.data;
    } catch (error) {
      console.error('Local service call failed:', error.message);
      throw error;
    }
  }

  /**
   * Get all AI digital human list
   * @param {string} domain - Domain parameter (contract will ignore this parameter and return all AI digital humans)
   * @returns {Promise<Array<Object>>}
   */
  async getAgentsByDomain() {
    if (!this.contracts.predictionMarket) {
      await this.init();
    }
    try {
      const agentIds = await this.contracts.predictionMarket.getAgentsByDomain('all');
      const agentIdsArray = agentIds.map(id => parseInt(id.toString()));
      
      // Get detailed information for each AI digital human
      const agents = await Promise.all(
        agentIdsArray.map(id => this.getAgent(id))
      );
      return agents;
    } catch (error) {
      console.error('Contract call failed:', error.message);
      throw error;
    }
  }

  /**
   * Get event prediction list
   * @param {number} eventId - Event ID
   * @returns {Promise<Array<Object>>}
   */
  async getEventPredictions(eventId) {
    if (!this.contracts.predictionMarket) {
      await this.init();
    }

    try {
      const predictIds = await this.contracts.predictionMarket.getEventPredictions(eventId);
      const predictIdsArray = predictIds.map(id => parseInt(id.toString()));
      // Get detailed information for each prediction
      const predictions = await Promise.all(
        predictIdsArray.map(id => this.getPrediction(id))
      );
      return predictions;
    } catch (error) {
      console.error('Contract call failed:', error.message);
      throw error;
    }
  }

  /**
   * Get AI digital human prediction list
   * @param {number} agentId - AI digital human ID
   * @returns {Promise<Array<Object>>}
   */
  async getAgentPredictions(agentId) {
    if (!this.contracts.predictionMarket) {
      await this.init();
    }

    try {
      const predictIds = await this.contracts.predictionMarket.getAgentPredictions(agentId);
      const predictIdsArray = predictIds.map(id => parseInt(id.toString()));
      
      // Get detailed information for each prediction
      const predictions = await Promise.all(
        predictIdsArray.map(id => this.getPrediction(id))
      );
      
      return predictions;
    } catch (error) {
      console.error('Contract call failed:', error.message);
      throw error;
    }
  }

  /**
   * Directly get all AI digital human ID list
   * @returns {Promise<Array<number>>}
   */
  async getAllAgentIds() {
    if (!this.contracts.predictionMarket) {
      await this.init();
    }
    try {
      const agentIds = await this.contracts.predictionMarket.getAllAgentIds();
      return agentIds.map(id => parseInt(id.toString()));
    } catch (error) {
      console.error('Contract call failed:', error.message);
      throw error;
    }
  }

  /**
   * Get account address
   * @returns {Promise<string>}
   */
  async getAccount() {
    if (!this.signer) {
      await this.init();
    }
    return await this.signer.getAddress();
  }

  /**
   * Switch network
   * @param {number} chainId - Chain ID
   * @returns {Promise<void>}
   */
  async switchNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
      throw error;
    }
  }

  /**
   * Listen for account changes
   * @param {Function} callback - Callback function
   */
  onAccountsChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        callback(accounts);
      });
    }
  }

  /**
   * Listen for network changes
   * @param {Function} callback - Callback function
   */
  onChainChanged(callback) {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', (chainId) => {
        callback(chainId);
      });
    }
  }

  /**
   * Pay fee
   * @returns {Promise<Object>} Transaction result
   */
  async payFee() {
    if (!this.contracts.predictionMarket) {
      await this.init();
    }

    try {
      // Call contract's payFee function, send 0.1MON
      const tx = await this.contracts.predictionMarket.payFee({
        value: ethers.utils.parseEther('0.1') // 0.1MON
      });
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash
      };
    } catch (error) {
      console.error('Failed to pay fee:', error);
      console.error('Error details:', JSON.stringify(error));
      
      // Parse error message to extract more user-friendly error message
      let errorMessage = 'Payment failed, please try again';
      
      // Handle different types of errors
      if (error.code === -32603) {
        // JSON-RPC error
        if (error.data && error.data.message) {
          if (error.data.message.includes('insufficient balance')) {
            errorMessage = 'Insufficient balance, please ensure you have enough funds in your wallet';
          } else if (error.data.message.includes('rejected')) {
            errorMessage = 'You rejected the payment request';
          } else {
            errorMessage = error.data.message;
          }
        } else {
          errorMessage = 'Wallet operation failed, please check your wallet status';
        }
      } else if (error.message) {
        if (error.message.includes('insufficient balance')) {
          errorMessage = 'Insufficient balance, please ensure you have enough funds in your wallet';
        } else if (error.message.includes('rejected')) {
          errorMessage = 'You rejected the payment request';
        } else if (error.message.includes('Fee must be exactly 0.1 MON')) {
          errorMessage = 'Payment amount must be 0.1MON';
        } else if (error.message.includes('Internal JSON-RPC error')) {
          errorMessage = 'Wallet operation failed, please check your wallet status';
        } else {
          errorMessage = error.message;
        }
      } else if (error.error) {
        errorMessage = error.error;
      }
            
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}

// Export singleton instance
const ethereumService = new EthereumService();

export {
  ethereumService,
  EthereumService
};
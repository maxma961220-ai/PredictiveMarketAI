<template>
  <a-config-provider theme="light">
    <div class="app-container">
      <!-- Navigation Bar -->
      <a-layout-header style="background: #fff; box-shadow: 0 1px 2px #eee; position: sticky; top: 0; z-index: 100;">
        <div class="header-container">
          <a-space>
            <i class="fa-solid fa-brain" style="font-size: 24px; color: #6366F1;" />
            <p class="logo-text" @click="toHome">AI Prediction Rank</p>
          </a-space>
          <a-space size="large">
            <router-link to="/" class="nav-link">Home</router-link>
            <span class="nav-link" style="cursor: pointer;" @click="navigateToRanking">Ranking</span>
            <router-link to="/about" class="nav-link">About</router-link>
          </a-space>
          <div class="wallet-section">
            <a-space v-if="!walletAddress" size="small">
              <a-button type="primary" @click="connectWallet" :loading="isConnecting">
                Connect Wallet
              </a-button>
            </a-space>
            <a-space v-else size="small">
              <span class="wallet-address">{{ formattedWalletAddress }}</span>
              <a-button type="default" @click="disconnectWallet">
                Disconnect
              </a-button>
            </a-space>
          </div>
        </div>
      </a-layout-header>

      <!-- Main Content Area -->
      <a-layout-content class="main-content">
        <div class="content-container">
          <router-view />
        </div>
      </a-layout-content>

      <!-- Footer -->
      <a-layout-footer class="app-footer">
        <span style="color: #666;">AI Digital Human Prediction Rankings © 2026 | Hackathon MVP</span>
      </a-layout-footer>
    </div>
  </a-config-provider>
</template>
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import walletService from './services/wallet.service'

const router = useRouter()
const walletAddress = ref('')
const isConnecting = ref(false)

const toHome = () => {
  router.push('/')
}

// Navigate to ranking page (wallet connection check required)
const navigateToRanking = () => {
  if (walletService.isWalletConnected()) {
    // Wallet connected, navigate directly to ranking
    router.push('/ranking')
  } else {
    // Wallet not connected, prompt user to connect wallet
    alert('Please connect your wallet before viewing the ranking')
  }
}

// Format wallet address
const formattedWalletAddress = computed(() => {
  if (!walletAddress.value) return ''
  return `${walletAddress.value.slice(0, 6)}...${walletAddress.value.slice(-4)}`
})

// Connect wallet
const connectWallet = async () => {
  isConnecting.value = true
  try {
    // Initialize wallet service
    walletService.init()
    // Connect wallet
    const result = await walletService.connect()
    if (result.success) {
      walletAddress.value = result.account
    } else {
      alert(`Failed to connect wallet: ${result.error}`)
    }
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    alert('Failed to connect wallet. Please make sure MetaMask is installed and unlocked.')
  } finally {
    isConnecting.value = false
  }
}

// Disconnect wallet
const disconnectWallet = async () => {
  try {
    await walletService.disconnect()
    walletAddress.value = ''
  } catch (error) {
    console.error('Failed to disconnect wallet:', error)
  }
}

// Handle wallet connected status change
const handleWalletConnected = (data) => {
  if (data && data.account) {
    walletAddress.value = data.account
  }
}

// Handle wallet disconnected
const handleWalletDisconnected = () => {
  walletAddress.value = ''
}

// Handle wallet address change
const handleAccountsChanged = (account) => {
  if (account) {
    walletAddress.value = account
  } else {
    walletAddress.value = ''
  }
}

// Initialize wallet service when component mounts
onMounted(() => {
  // Initialize wallet service
  walletService.init()
  
  // Add event listeners
  walletService.on('connected', handleWalletConnected)
  walletService.on('disconnected', handleWalletDisconnected)
  walletService.on('accountChanged', handleAccountsChanged)
  
  // Check existing connection
  const account = walletService.getAccount()
  if (account) {
    walletAddress.value = account
  } else {
    // When page refreshes, if previously connected, need to reconnect wallet
    // Not auto-connecting here, user needs to click connect button manually
    // Because auto-connect might trigger MetaMask popup, affecting user experience
  }
})

// Clean up event listeners when component unmounts
onBeforeUnmount(() => {
  // Clean up event listeners
  walletService.off('connected', handleWalletConnected)
  walletService.off('disconnected', handleWalletDisconnected)
  walletService.off('accountChanged', handleAccountsChanged)
})
</script>
<style>
/* 全局样式重置，匹配原始HTML */
:root {
  --primary-6: #6366F1;
  --arcoblue-6: #6366F1;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: #f9fafb;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2937;
  line-height: 1.5;
}

/* 调整Arco Design默认样式 */
.arco-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.arco-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.arco-btn {
  border: none;
  border-radius: 9999px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.arco-btn-primary {
  border: none;
  background-color: #6366F1;
  border-color: #6366F1;
}

.arco-btn-primary:hover {
  border: none;
  background-color: #4f46e5;
  border-color: #4f46e5;
}

.arco-tag {
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 8px;
}

.arco-divider {
  margin: 16px 0;
}

/* 链接样式 */
.arco-link {
  color: #6366F1;
}

.arco-link:hover {
  color: #4f46e5;
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 钱包部分样式 */
.wallet-section {
  display: flex;
  align-items: center;
}

.wallet-address {
  font-size: 14px;
  color: #6b7280;
  font-family: monospace;
  margin-right: 8px;
  min-width: 120px;
  text-align: right;
}

.logo-text {
  font-size: 20px;
  font-weight: bold;
  color: #1F2937;
  text-decoration: none;
  cursor: pointer;
}

.nav-link {
  color: #6b7280;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #6366F1;
}

.router-link-active {
  color: #6366F1;
  font-weight: 500;
}

/* 主内容区样式 */
.main-content {
  flex: 1;
  padding: 0px 16px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 页脚样式 */
.app-footer {
  text-align: center;
  background: #fff;
  padding: 20px 0;
  border-top: 1px solid #eee;
  margin-top: auto;
}
</style>

<style scoped>
/* 确保选中的按钮使用正确的主题色 */
:deep(.arco-btn-primary) {
  background-color: #6366F1 !important;
  border-color: #6366F1 !important;
  border: none !important;
  padding: 8px 16px !important;
  min-width: 64px !important;
  box-sizing: border-box !important;
}

:deep(.arco-btn-primary:hover) {
  background-color: #4f46e5 !important;
  border-color: #4f46e5 !important;
  border: none !important;
  padding: 8px 16px !important;
  min-width: 64px !important;
  box-sizing: border-box !important;
}
</style>

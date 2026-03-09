<template>
  <div class="event-card" @click="handleClick">
    <div class="event-header">
      <a-tag :color="getDomainColor(event.domain)" class="domain-tag">
        {{ getDomainName(event.domain) }}
      </a-tag>
      <a-tag :color="getStatusColor(event.status)" class="status-tag">
        {{ getStatusName(event.status) }}
      </a-tag>
    </div>
    <h3 class="event-title">{{ event.title }}</h3>
    <div class="event-probability">
      <span class="probability-label">{{ event.status === 'active' ? 'Current Market Probability: ' : 'Final Result: ' }}</span>
      <span class="probability-value">{{ event.status === 'active' ? event.market_probability : event.result }}</span>
    </div>
    <div class="event-deadline">
      {{ event.status === 'active' ? 'Deadline: ' : 'End Time: ' }}{{ event.deadline }}
    </div>
    <div class="view-button-wrapper">
      <a-button type="primary" block size="small" class="view-button" @click.stop="handleClick">
        View AI Predictions <icon-arrow-right class="arrow-icon" />
      </a-button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click')
}

// 获取领域标签颜色
const getDomainColor = (domain) => {
  // 处理多个领域的情况，取第一个领域的颜色
  const firstDomain = domain.split(',').map(d => d.trim().toLowerCase())[0]
  const colorMap = {
    crypto: 'purple',
    courts: 'red',
    politics: 'blue',
    economy: 'green',
    sports: 'orange',
    technology: 'geekblue',
    healthcare: 'cyan',
    climate: 'teal',
    entertainment: 'magenta',
    finance: 'yellow',
    markets: 'gold',
    regulation: 'gray',
    elections: 'indigo'
  }
  return colorMap[firstDomain] || 'gray'
}

// Get domain name
const getDomainName = (domain) => {
  // Handle multiple domains, convert each domain to English name
  const domains = domain.split(',').map(d => d.trim().toLowerCase())
  const nameMap = {
    crypto: 'Crypto',
    courts: 'Legal',
    politics: 'Politics',
    economy: 'Economy',
    sports: 'Sports',
    technology: 'Technology',
    healthcare: 'Healthcare',
    climate: 'Climate',
    entertainment: 'Entertainment',
    finance: 'Finance',
    markets: 'Markets',
    regulation: 'Regulation',
    elections: 'Elections',
    other: 'Other'
  }
  return domains.map(d => nameMap[d] || 'Other').join(', ')
}

// Get status color
const getStatusColor = (status) => {
  // Handle status as number or string
  const statusValue = typeof status === 'string' ? status.toLowerCase() : status
  if (statusValue === 'active' || statusValue === 1) {
    return 'green'
  } else if (statusValue === 'ended' || statusValue === 2) {
    return 'gray'
  }
  return 'gray'
}

// Get status name
const getStatusName = (status) => {
  // Handle status as number or string
  const statusValue = typeof status === 'string' ? status.toLowerCase() : status
  if (statusValue === 'active' || statusValue === 1) {
    return 'In Progress'
  } else if (statusValue === 'ended' || statusValue === 2) {
    return 'Ended'
  }
  return 'Unknown'
}
</script>

<style scoped>
.event-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.event-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.domain-tag,
.status-tag {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 9999px;
}

.event-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1f2937;
  line-height: 1.4;
}

.event-probability {
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 14px;
}

.probability-value {
  font-weight: 700;
  color: #1f2937;
  font-size: 16px;
}

.event-deadline {
  margin-bottom: 20px;
  color: #9ca3af;
  font-size: 14px;
}

.view-button-wrapper {
  display: block;
  margin-top: auto;
}

.view-button {
  width: 100%;
  border-radius: 10px;
  height: 40px;
  font-weight: 500;
}

.arrow-icon {
  margin-left: 4px;
  font-size: 12px;
}
</style>
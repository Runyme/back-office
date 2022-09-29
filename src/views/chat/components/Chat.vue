<template>
  <div class="flex flex-col">
    <ChatHeader @attendanceFinished="$emit('attendanceFinished')"/>
    <ChatMessages/>
    <ChatActions />
  </div>
</template>

<script>

import ChatHeader from '@/views/chat/components/Header'
import ChatMessages from '@/views/chat/components/Messages'
import ChatActions from '@/views/chat/components/Actions'

export default {
  name: 'Chat',
  components: { ChatHeader, ChatMessages, ChatActions, },
}
</script>

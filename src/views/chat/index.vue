<template>
  <div class="chat-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
      fixed
    />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <div class="message-list" ref="message-list">
      <div
        class="message-item"
        :class="{ reverse: item.isMe }"
        v-for="(item, index) in messages"
        :key="index"
      >
        <van-image
          class="avatar"
          slot="icon"
          round
          width="30"
          height="30"
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
        <div class="msg-wrap" style="flex: 1;">
          <div class="title">{{ item.msg }}</div>
        </div>
      </div>
    </div>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message">
      <van-field v-model.trim="message" center clearable>
        <van-button slot="button" size="small" type="primary" @click="onSend"
          >发送</van-button
        >
      </van-field>
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'chat',
  data() {
    return {
      message: '', // 输入的数据
      socket: null, // 把socket定义到整个组件
      messages: getItem('chat-messages') || [] // 消息列表
    }
  },
  watch: {
    // 当有新消息时，把数据存到本地
    messages(newVal) {
      setItem('chat-messages', newVal)
      this.$nextTick(() => {
        this.toBottom()
      })
    }
  },
  created() {
    const socket = io('http://ttapi.research.itcast.cn')
    this.socket = socket

    socket.on('connect', () => {
      console.log('链接成功')
    })

    socket.on('message', message => {
      // 监听服务端发来的消息，放入消息列表
      this.messages.push(message)
    })
  },
  methods: {
    onSend() {
      const message = this.message
      if (!message.length) {
        return
      }
      const data = {
        msg: message,
        timestamp: Date.now(),
        isMe: true
      }

      this.socket.emit('message', data)

      this.messages.push(data)

      this.message = ''
    },
    toBottom() {
      // 把页面滚动到最底部
      const listContainer = this.$refs['message-list']
      listContainer.scrollTop = listContainer.scrollHeight
    }
  }
}
</script>

<style scoped lang="less">
.chat-container {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 46px 0 50px 0;
  top: 0;
  left: 0;
  box-sizing: border-box;
  background: #f5f5f6;
  .message-list {
    height: 100%;
    overflow-y: scroll;
    .message-item {
      display: flex;
      flex-flow: row nowrap;
      align-items: flex-start;
      padding: 10px;
      .msg-wrap {
        word-break: break-all;
        word-wrap: break-word;
      }
      .title {
        display: table;
        background: #e0effb;
        border-radius: 6px;
        font-size: 14px;
        padding: 10px 10px;
        margin-right: 45px;
      }
      .avatar {
        width: 40px;
        height: 40px;
        margin-right: 5px;
      }
    }
    .reverse {
      flex-direction: row-reverse;
      .msg-wrap {
        display: flex;
        flex-direction: row-reverse;
        .title {
          margin-right: 5px;
          margin-left: 45px;
        }
      }
    }
  }
  .send-message {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #f5f5f6 !important;
  }
}
</style>

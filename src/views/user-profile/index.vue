<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="编辑资料"
      left-arrow
      @click-left="$router.back()"
    />

    <van-cell-group>
      <van-cell is-link title="头像" @click="onAvatarClick">
        <van-image class="avatar" round fit="cover" :src="user.photo" />
      </van-cell>

      <input type="file" hidden ref="file" @change="onFileChange" />

      <van-cell
        is-link
        title="昵称"
        :value="user.name"
        @click="isEditNameShow = true"
      ></van-cell>

      <van-cell
        is-link
        title="性别"
        :value="user.gender === 0 ? '男' : '女'"
        @click="isEditGenderShow = true"
      ></van-cell>

      <van-cell
        is-link
        title="生日"
        :value="user.birthday"
        @click="isEditBirthdayShow = true"
      ></van-cell>
    </van-cell-group>

    <!-- 头像预览 -->
    <van-image-preview
      v-model="isPreviewShow"
      :images="images"
      @close="$refs.file.value = ''"
    >
      <van-nav-bar
        slot="cover"
        left-text="取消"
        right-text="确定"
        @click-left="isPreviewShow = false"
        @click-right="onUpdateAvatar"
      />
    </van-image-preview>

    <!-- 修改昵称 -->
    <van-popup v-model="isEditNameShow" position="bottom">
      <van-nav-bar
        title="编辑昵称"
        left-text="取消"
        right-text="确定"
        @click-left="isEditNameShow = false"
        @click-right="onUpdateName"
      />
      <div class="name-wrapper">
        <!-- $event表示事件参数 -->
        <van-field
          :value="user.name"
          @input="inputName = $event"
          rows="2"
          autosize
          type="textarea"
          maxlength="20"
          placeholder="请输入昵称"
          show-word-limit
        />
      </div>
    </van-popup>

    <!-- 编辑性别 -->
    <van-action-sheet
      v-model="isEditGenderShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="isEditGenderShow = false"
      @select="onGenderSelect"
    />

    <!-- 编辑生日 -->
    <van-popup v-model="isEditBirthdayShow" position="bottom">
      <van-datetime-picker
        :value="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="isEditBirthdayShow = false"
        @confirm="onUpdateBirthday"
      />
    </van-popup>
  </div>
</template>

<script>
import { getProfile, updateUserPhoto, updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'userProfile',
  components: {},
  data() {
    return {
      user: {},
      isPreviewShow: false,
      images: [], // 要预览的图片列表
      isEditNameShow: false,
      inputName: '', // 输入的昵称
      isEditGenderShow: false,
      actions: [
        { name: '男', value: 0 },
        { name: '女', value: 1 }
      ],
      isEditBirthdayShow: false,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date()
    }
  },
  computed: {
    file() {
      return this.$refs['file']
    },
    currentDate() {
      // 把默认的选项设置为我们请求回来的数据
      return new Date(this.user.birthday)
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getProfile()
        this.user = data.data
      } catch (error) {
        this.$toast.fail('获取数据失败')
      }
    },

    onAvatarClick() {
      this.file.click()
    },

    onFileChange() {
      // 1、 拿到 file 类型 input 选择的文件对象
      const fileObj = this.file.files[0]

      // 2、 使用 window.URL.createObjectURL(file) 得到文件数据
      const fileData = window.URL.createObjectURL(fileObj)

      // 3、 将img的src = 第二步的结果
      this.images = [fileData] // 这里直接重置数组， 防止出现多张图片
      this.isPreviewShow = true
    },

    async onUpdateAvatar() {
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '更新中...' // 提示消息
      })

      // 1、构造包含文件数据的表单对象 FormData
      try {
        // 构造包含文件数据的表单对象 FormData
        const fd = new FormData()
        fd.append('photo', this.file.files[0])

        const { data } = await updateUserPhoto(fd)
        this.$toast.success('更新头像成功')

        // 关闭预览，更新头像
        this.isPreviewShow = false
        this.user.photo = data.data.photo
      } catch (error) {
        this.$toast.fail('更新头像失败')
      }
    },

    async updateUserProfile(filed, value) {
      // filed:：要修改的字段， value：值
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '更新中...' // 提示消息
      })

      try {
        await updateUserProfile({
          [filed]: value // 注意属性名用中括号包裹，否则会当成字符串，而不是变量值
        })
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast.fail('更新失败')
      }
    },

    async onUpdateName() {
      await this.updateUserProfile('name', this.inputName)
      this.user.name = this.inputName
      this.isEditNameShow = false
    },

    async onGenderSelect(data) {
      await this.updateUserProfile('gender', data.value)
      this.user.gender = data.value
      this.isEditGenderShow = false
    },

    async onUpdateBirthday(value) {
      // 格式化时间格式
      const date = dayjs(value).format('YYYY-MM-DD')
      await this.updateUserProfile('birthday', date)
      this.user.birthday = date
      this.isEditBirthdayShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile {
  /deep/ .van-cell {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar {
    width: 45px;
    height: 45px;
  }
}

/deep/ .van-image-preview__cover {
  top: unset;
  left: 0;
  right: 0;
  bottom: 0;
  .van-nav-bar {
    background-color: #000;
  }
}

.name-wrapper {
  background-color: #f0f0f0;
  padding: 5px;
}
</style>

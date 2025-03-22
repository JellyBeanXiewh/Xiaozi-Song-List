<script setup lang="ts">
import { useToast } from 'vue-toastification'
import { ref, onMounted } from 'vue'
import SongList from './assets/json/song_list.json'

const toast = useToast()
const nowLang = ref('')
const searchContent = ref()
const clientWidth = ref(document.documentElement.clientWidth)

const songList = ref(SongList)
const showSongList = ref()
showSongList.value = songList.value

const langSet = new Set(SongList.map((item) => item.lang))

function copySongName(song: string) {
  navigator.clipboard.writeText(`点歌  ${song}`)

  toast.success(`“${song}”已复制到剪贴板`, {
    timeout: 3000,
  })
}

function randomCopy() {
  let rand = Math.floor(Math.random() * (songList.value.length - 1))
  copySongName(songList.value[rand].song)
}

function switchLang(lang: string) {
  showSongList.value = songList.value
  if (lang !== '') {
    showSongList.value = showSongList.value.filter(
      (item: { lang: string }) => item.lang === lang,
    )
  }
  searchContent.value = null
  nowLang.value = lang
}

const timeout = ref()

function inputSearch(content: string) {
  clearTimeout(timeout.value)
  timeout.value = setTimeout(() => {
    showSongList.value = songList.value
    if (content == '' || content == null) return
    showSongList.value = showSongList.value.filter(
      (item: {
        song: string
        artist: string
        remark: string
        style: string
      }) => {
        let flag = false
        if (item.song !== '' && item.song !== null) {
          flag = item.song.includes(content)
        }
        if (item.artist !== '' && item.artist !== null && !flag) {
          flag = item.artist.includes(content)
        }
        if (item.remark !== '' && item.remark !== null && !flag) {
          flag = item.remark.includes(content)
        }
        return flag
      },
    )
  }, 300)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', scrollWatch, true)
})

const scroll = ref(0)

function scrollWatch() {
  scroll.value = document.documentElement.scrollTop || document.body.scrollTop
}
</script>

<template>
  <div
    v-show="scroll>150"
    @click="scrollToTop"
    class="fixed bottom-12 right-4 lg:right-16 lg:bottom-14 w-10 h-10 leading-10 rounded-lg bg-white shadow-lg hover:shadow-xl text-center duration-200 z-50 hover:cursor-pointer"
  >
    <i class="fa-solid fa-arrow-up text-gray-500"></i>
  </div>
  <div class="w-full h-full bg text-center justify-center flex">
    <div class="xl:w-1280 md:w-5/6 w-11/12">
      <div class="row-auto flex flex-wrap">
        <div class="title w-full">
          <div class="title-box w-full">
            <div
              class="h-32 w-32 selection:avatar mt-10 md:mt-20 mb-2 hover:scale-105 shadow-xl rounded-full overflow-hidden hover:shadow-2xl duration-700 inline-block"
            >
              <img src="./assets/img/avatar.jpg" class="w-full h-full" alt="">
            </div>
            <div class="name text-4xl font-bold my-4 animate__animated animate__rubberBand">小紫才没有摸鱼</div>
            <div class="text-xl animate__animated animate__rubberBand">
              和她唱过的
              <span class="font-normal">{{ songList.length }}</span> 首歌
            </div>
          </div>
          <div class="intro-box text-start md:block hidden">
            <div class="intro-box-inner p-4 rounded-2xl border-fuchsia-700 border-2">
              <!--TODO: 使用v-for渲染-->
              <div class="justify-between flex h-9">
                <p class="text-xl font-semibold">小紫的自我介绍</p>
                <div class="flex external-link">
                  <a
                    class="cursor-pointer"
                    target="_blank"
                    href="https://space.bilibili.com/237140787"
                    title="小紫的哔哩哔哩主页"
                  >
                    <img src="./assets/icon/bilibili.ico" :width="24" :height="24" alt="哔哩哔哩">
                  </a>
                  <a
                    class="cursor-pointer"
                    target="_blank"
                    href="https://www.douyin.com/user/MS4wLjABAAAA3dM0RZ_5Zza3z2FgUdjSxvy-VQf58-JyMChyJ1P6va0lysRHZoQ2SXPRCee3Atl-"
                    title="小紫的抖音主页"
                  >
                    <img src="./assets/icon/tiktok.png" :width="24" :height="24" alt="抖音">
                  </a>
                  <a
                    class="cursor-pointer"
                    target="_blank"
                    href="https://www.xiaohongshu.com/user/profile/6287f0a60000000021020004"
                    title="小紫的小红书主页"
                  >
                    <img src="./assets/icon/xiaohongshu.ico" :width="24" :height="24" alt="小红书">
                  </a>
                  <a
                    class="cursor-pointer"
                    target="_blank"
                    href="https://qm.qq.com/cgi-bin/qm/qr?k=PHl4yTgj3dJ2RbY0hrJfMo21j9j97YmX&group_code=505200250"
                    title="小紫的直播通知群"
                  >
                    <img src="./assets/icon/qq.png" :width="24" :height="24" alt="QQ群">
                  </a>
                  <a
                    class="cursor-pointer"
                    target="_blank"
                    href="https://pd.qq.com/g/03koe835z9"
                    title="小紫的腾讯频道"
                  >
                    <img src="./assets/icon/qq_guild.ico" width="24" height="24" alt="腾讯频道">
                  </a>
                </div>
              </div>
              <p> ▌这里是正在努力的个人势 VTuber 天才美少女机械师！叫我小紫、紫宝都可以~</p>
              <p> ▌⏰出道日：5.02</p>
              <p> ▌🎂生日：10.08</p>
              <p> ▌直播内容一般为游戏 / 杂谈 / 唱歌 / 整活，互动陪伴型直播间，努力让你感受赛博之家的温暖~！</p>
              <p> ▌MBTI 是超绝小护士 ISFJ，生活中发生的事事都可以来直播间和紫宝说噢，主打积极阳光正能量的陪伴~！</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="lang-selector my-6 mx-auto rounded-2xl border-fuchsia-700 border-2 hover:shadow-lg grid grid-cols-2 md:grid-cols-4 gap-3 p-4 md:p-6 duration-500"
      >
        <div
          v-for="(lang, index) in langSet"
          :key="index"
          @click="switchLang(lang)"
          class="option rounded-2xl h-10 leading-10 duration-500 bg-opacity-80 bg-white cursor-pointer hover:bg-opacity-100 hover:shadow-lg"
          :class="nowLang === lang ? 'border border-fuchsia-500' : ''"
        >{{ lang }}
        </div>
        <div
          @click="switchLang('')"
          class="option rounded-2xl h-10 leading-10 duration-500 bg-opacity-80 bg-white cursor-pointer hover:bg-opacity-100 hover:shadow-lg order-last"
        >重置
        </div>
      </div>
      <div class="mb-6 grid md:grid-cols-4 md:gap-4 px-4 md:px-6">
        <input
          type="search"
          placeholder="搜索"
          @input="inputSearch(searchContent)"
          v-model="searchContent"
          class="bg-white md:col-span-3 rounded-2xl w-full mb-3 md:mb-0 h-10 px-4 text-black"
        >
        <div
          @click="randomCopy()"
          class="md:col-span-1 h-10 w-full duration-500 bg-opacity-80 bg-white cursor-pointer hover:bg-opacity-100 hover:shadow-lg rounded-2xl leading-10"
        >随便听听
        </div>
      </div>
      <div class="mb-2 text-gray-500">
        <i class="fa-regular fa-copy mr-1"></i>轻点歌名可以复制哦~
      </div>
      <div class="p-2">
        <table class="w-full mb-6 hover:shadow-lg duration-700">
          <thead class="w-full border-b-2 border-fuchsia-800">
          <tr>
            <th class="w-2/6">歌名</th>
            <th class="w-2/6">歌手</th>
            <th class="hidden md:table-cell w-1/6">语言</th>
            <th class="hidden md:table-cell">备注</th>
          </tr>
          </thead>
          <tbody>
          <tr @click="copySongName(item.song)" v-for="(item, index) in showSongList" :key="index">
            <th>{{ item.song }}</th>
            <th>{{ item.artist }}</th>
            <th class="hidden md:table-cell">{{ item.lang }}</th>
            <th class="hidden md:table-cell">{{ item.remark }}</th>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="text-center text-gray-400 pb-8 mt-6">
        <div class="text-purple-400 animate__animated animate__bounce animate__infinite">
          <i class="fa-solid fa-heart"></i>
        </div>
        <div class="m-2 text-sm">
          <a
            class="cursor-pointer hover:border-b border-gray-400"
            target="_blank"
            href="https://beian.miit.gov.cn/"
          >
            这里放备案号
          </a>
        </div>
        <div class="mt-2 text-sm">
          <span>Presented by </span>
          <a
            class="cursor-pointer text-yellow-500 hover:border-b border-yellow-500"
            target="_blank"
            href="https://space.bilibili.com/30573758"
          >
            <i class="fa-brands fa-bilibili mr-1"></i>加勒比海没有盗
          </a>
        </div>
        <div class="mx-auto text-sm">
          <i class="fa-regular fa-copyright mr-2 text-sm"></i>
          <span class="mr-2">2025</span>
          <span class="mr-2 inline-block mt-2">小紫的歌单</span>
          <span>
            <a
              href="https://github.com/JellyBeanXiewh/Xiaozi-Song-List"
              target="_blank"
              class="text-yellow-500 cursor-pointer hover:border-b border-yellow-500"
            >
              <i class="fa-brands fa-github mr-1"></i>GitHub
            </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg {
  margin: 0;
  padding: 0;
  background-position-x: left;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100vh;
  z-index: -1;
  background-color: #edd1d8;
  background-image: linear-gradient(0deg, #edd1d8d0, #edd1d8d0), url('./assets/img/bg.jpg');
}

.title-box {
  transition: transform 1s ease-out;

  .name {
    font-family: 'Noto Serif SC', 'Source Han Serif SC', 'Source Han Serif', 'source-han-serif-sc', 'PT Serif', 'SongTi SC', 'PingFang SC', 'Microsoft Yahei', 'MicroSoft YaHei UI', system-ui, serif;
  }
}

.intro-box {
  position: relative;
  //left: 40%;
  top: -90%;
  //width: 60%;
  opacity: 0;
  transition: opacity 1s;

  .intro-box-inner {
    background-color: rgba(255, 255, 255, 0.5);
    position: absolute;
  }
}

.title:hover {
  .title-box {
    transform: none;
  }
}

.external-link {
  a {
    margin-left: 0.5rem;
  }
}

.lang-selector {
  background-color: rgba(255, 255, 255, 0.25);
}

table {
  background: rgba(255, 255, 255, 0.352);

  thead th {
    font-weight: 600;
  }

  tbody th {
    font-weight: 400;
  }
}

tr {
  height: 2.5rem;
}

tr:hover {
  background: rgba(255, 255, 255, 0.884);
  transition: all 300ms;
}

tr:active {
  background: rgba(255, 115, 115, 0.884);
  transition: all 50ms;
}

@media (min-width: 768px) {
  .bg {
    background-position: top center;
    background-size: cover;
  }
  .intro-box {
    left: 42%;
    top: -90%;
    width: 58%;
  }
  .title:hover {
    .title-box {
      transform: translateX(-30%);
    }

    .intro-box {
      opacity: 1;
    }
  }
}

@media (min-width: 1024px) {
  .intro-box {
    left: 40%;
    top: -82%;
    width: 60%;
  }
  .title:hover {
    .title-box {
      transform: translateX(-30%);
    }
  }
}

@media (min-width: 1280px) {
  .intro-box {
    left: 40%;
    top: -75%;
    width: 50%;
  }
  .title:hover {
    .title-box {
      transform: translateX(-25%);
    }
  }
}
</style>

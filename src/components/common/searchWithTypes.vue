<template>
  <div class="w-full min-w-[1200px] py-[40px]  flex flex-col items-center">
    <div class="w-[1040px] flex justify-between">
      <el-input :style="{ flex: 1 }" v-model="keyword" prefix-icon="Search" :placeholder="`搜索${cnWord}`" clearable
        @change="updateSearch">
        <template #append>
          <el-button @click="updateSearch">找{{ cnWord }}</el-button>
        </template>
      </el-input>
      <div v-if="pageInfo.canAddEvent&&cnWord==='活动'" class="plain-btn w-[130px] h-[48px] ml-[24px]" @click="addEvent">发起活动</div>
    </div>
    <div class="w-[1200px] flex" v-for="(item, index) in typeList" :key="index">
      <div class="text-[16px] mt-[30px] text-[#434447] font-[600]">{{ item.name }}:</div>
      <div class="flex-1 min-w-0">
        <div class="flex">
          <div :ref="(el) => setRef(el, index)" class="flex flex-1 mt-[14px] defualt-over">
            <div class="ml-[32px] mt-[16px]  text-[14px] text-[#434447] cursor-pointer"
              :class="[activeObj[item.key] === ite.id ? 'text-[var(--primary)] ' : '']"
              @click="chooseType(item, ite, idx)" v-for="(ite, idx) in item.infoList" :key="idx"> {{ ite.name }}
            </div>
          </div>
          <div v-if="item.isOver" class="ml-[0px] mt-[28px] text-[14px] text-[var(--primary)] font-[600] cursor-pointer"
            @click="changeExpand(item, index)">
            <span class="mr-[16px] text-[var(--main-text)]" style="user-select: none">{{ item.isExpand ? '' : '...' }}</span>
            <i class="inline-block iconfont icon-arrow-down-filling" :class="[item.isExpand ? 'rotate-180' : '']"></i>
            <span style="user-select: none" class="ml-[5px]">{{ item.isExpand ? '收起' : '展开' }}</span>
          </div>
        </div>
        <div v-if="calcChildList(item) && calcChildList(item).length"
          class="flex flex-wrap bg-[#f8f8f8] rounded-[4px] mt-[12px] ml-[32px]  px-[24px] py-[10px]">
          <div class="flex flex-1 defualt-over" :ref="(el) => setChildRef(el, index, item)">
            <div v-for="(el, idx) in calcChildList(item)" :key=idx
              class="text-[14px] leading-[2.5] text-[#666666] cursor-pointer" @click="chooseType2(item, el, idx)"
              :class="[idx !== calcChildList(item).length - 1 ? 'mr-[24px]' : '',activeObj[item.key2] === el.id ? 'text-[var(--primary)]  font-[600]' : '', idx > item.childTwist && item.childTwist !== calcChildList(item).length - 1 ? 'hidden' : '']">
              {{ el.name }}
            </div>
          </div>
          <div v-if="item.isChildOver"
            class="ml-[24px] text-[14px] leading-[2.5] text-[var(--primary)] font-[600] cursor-pointer"
            @click="changeChildExpand(item, index)(item)">
            <i class="inline-block iconfont icon-arrow-down-filling mr-[5px]" style="font-size: 12px;"
              :class="[item.isChildExpand ? 'rotate-180' : '']"></i>
            {{ item.isChildExpand ? '收起' : '展开' }}
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { mappingDataApi } from '@/api/common'
import { homeBtnApi } from '@/api/home'
import { nextTick } from 'vue'
import theme from '@/utils/theme'
const props = defineProps({
  type: {
    type: String,
    default: 'activity'
  }
})
const cnWord = {
  'activity': '活动',
  'tribe': '部落',
}[props.type]
const keyword = ref(undefined)

// 主数据
const typeList = ref([])

// 选中的集合
const activeObj = ref({})

// dom集合
const refObj = ref(new Map())
const setRef = (el, index) => {
  if (el) {
    refObj.value.set(index, el)
  }
}

const changeExpand = (item, index) => {
  item.isExpand = !item.isExpand
  const dom = refObj.value.get(index)
  item.isExpand
    ? dom.classList.add('flex-wrap')
    : dom.classList.remove('flex-wrap')
}

const childRefObj = ref(new Map())
const setChildRef = (el, index, item) => {
  // console.log(item.parentActiveIndex)
  if (el) {
    childRefObj.value.set(index, el)
  }
  // console.log(childRefObj.value,9999999999999)
}
const changeChildExpand = (item, index) => {
  item.isChildExpand = !item.isChildExpand
  const dom = childRefObj.value.get(index)
  item.isChildExpand
    ? dom.classList.add('flex-wrap')
    : dom.classList.remove('flex-wrap')
}

const emit = defineEmits(['search'])

const updateSearch = () => {
  emit('search', { title: keyword.value, ...activeObj.value })
}

const chooseType = (item, ite, idx) => {
  activeObj.value[item.key] = ite.id
  activeObj.value[item.key2] = undefined
  item.parentActiveIndex = idx
  nextTick(() => {
    getIsOver(typeList.value, childRefObj.value, 'isChildOver')
  })
  emit('search', { title: keyword.value, ...activeObj.value })
}

const chooseType2 = (item, ite, idx) => {
  activeObj.value[item.key2] = ite.id
  emit('search', { title: keyword.value, ...activeObj.value })
}

const calcChildList = (item) => item.infoList.find(ite => activeObj.value[item.key] === ite.id).infoList

const getList = async () => {
  const key = {
    activity: 'eventFilter',
    tribe: 'tribeFilter'
  }[props.type]
  const res = await mappingDataApi({ key })
  typeList.value = res.data.list.filter((item) => item.key !== 'sort' && item.name !== '活动排序')
  typeList.value.forEach((item) => {
    item.isExpand = false
    item.isChildExpand = false
    item.infoList.unshift({ name: '全部', id: undefined })
    // console.log(item.infoList)
    activeObj.value[item.key] = undefined
  })
  nextTick(() => {
    getIsOver(typeList.value, refObj.value, 'isOver')
    getIsOver(typeList.value, childRefObj.value, 'isChildOver')
  })
}

// 设置list每一项的是否溢出
const getIsOver = (listName, refObj, overText) => {
  listName.forEach((item, index) => {
    const dom = refObj.get(index)
    if (!dom) {
      return
    }
    const childList = dom.children
    const marginLeft = { isOver: 32, isChildOver: 24 }[overText]
    const parentWidth = { isOver: dom.clientWidth, isChildOver: dom.clientWidth - 48 }[overText]
    const childrenWidth = Array.from(childList).reduce(
      (totalWidth, child, currentIndex) => {
        const childWidth = child.offsetWidth // 获取子元素宽度
        // if (overText === 'isChildOver') {
        //   if (Array.from(childList).length < 3) {
        //     item.childTwist = undefined
        //     item.childOriginTwist = undefined
        //     return
        //   }
        //   console.log(totalWidth, totalWidth + childWidth + marginLeft, parentWidth, currentIndex, child, childWidth)
        //   if (totalWidth < parentWidth&&totalWidth + childWidth + marginLeft >= parentWidth) {
        //     if (childWidth < 44 || totalWidth + childWidth + marginLeft >= parentWidth) {
        //       // 换行了多减一个 最后一个放不下也多减一个
        //       item.childTwist = currentIndex - 2
        //       item.childOriginTwist = currentIndex - 2
        //     } else {
        //       item.childTwist = currentIndex - 1
        //       item.childOriginTwist = currentIndex - 1
        //     }
        //   }
        // }
        return totalWidth + childWidth + marginLeft
      },
      0
    )
    if (childrenWidth > parentWidth) {
      item[overText] = true
    } else {
      item[overText] = false
    }
    // console.log(overText, item[overText], item.childTwist)
  })
}

getList()

const addEvent = async () => {
  let host = ''
  if (theme.name === '兰州理工') {
    host = import.meta.env.VITE_ADMIN_HOST
  } else {
    host = import.meta.env.VITE_PU_ADMIN_HOST
  }
  const user = JSON.parse(localStorage.getItem('user'))
  // location.href = host + `/active/actives/add?token=${user.token}&sid=${user.sid}`
  window.open(host + `/active/actives/add?token=${user.token}&sid=${user.sid}&riseType=common`)
}

const pageInfo = reactive({})
const getBtn = async () => {
  const res = await homeBtnApi()
  pageInfo.canAddEvent = res.data.showAddEvent
}
getBtn()
</script>
<style scoped lang="scss">
.defualt-over {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep(.el-input) {
  // width: 1040px;
  height: 48px;
}

::v-deep(.el-input__wrapper) {
  border-radius: 8px 0 0 8px;
  box-shadow: 0 0 0 1px var(--primary) inset;
}

::v-deep(.el-input-group__append) {
  button {
    height: 100%;
    padding: 0 46px;
    background: var(--primary);
    color: #fff;
    border-radius:  0 4px 4px 0;
  }

  button:hover {
    background: var(--hover);
    color: #fff;
  }
}
</style>

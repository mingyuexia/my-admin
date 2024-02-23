<template>
    <div v-if="isShow" class="w-full min-w-[1200px] py-[12px]  flex justify-center">
        <div class="w-[1200px] flex items-center">
            <div v-for="(item, index) in  breadList" :key="index" class="mr-[8px] text-[16px] text-[#434447] flex items-center"
                :class="[index !== breadList.length - 1 ? 'cursor-pointer hover:text-[var(--primary)]' : '']"
                @click="toThis(item, index)">
                <span>{{ item.meta.title }}</span>
                <i v-if="index !== breadList.length - 1" class="ml-[8px] iconfont icon-arrow-right-bold" @click="last"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
const isShow = ref(false)
const route = useRoute();
const router = useRouter()
const breadList = ref([])
watch(() => route.path, (newVal) => {
    route.matched.forEach(item => {
        if (item.path === route.path) {
            item.fullPath = route.fullPath
        }
    })
}, { immediate: true })

watch(() => route.matched, (newVal) => {
    console.log(newVal, route)
    let seriesRoute = newVal.filter(
        (item, index, self) => self.findIndex((t) => t.path === item.path) === index
    )
    if (!sessionStorage.getItem('breadList')) {
        sessionStorage.setItem('breadList', JSON.stringify(seriesRoute,['meta','path','fullPath','title']))
    } else {
        const storeBreadList = JSON.parse(sessionStorage.getItem('breadList'))
        if (storeBreadList.length && seriesRoute.length ) {
            const isOldPath = storeBreadList.every((item1, index) => {
                const item2 = seriesRoute[index];
                // 判断每一项是否存在，以及 path 字段是否相等
                return item1 && item2 && item1.path === item2.path&& storeBreadList.length === seriesRoute.length;
            });
            if (!isOldPath) {
                sessionStorage.setItem('breadList', JSON.stringify(seriesRoute,['meta','path','fullPath','title']))
            }else{
                seriesRoute=storeBreadList
            }
        }
    }
    // if (seriesRoute.length > 2 && ['/activity'].includes(seriesRoute[1].path)) {
    if (route.meta.needBread) {
        isShow.value = true
        breadList.value = seriesRoute
    } else {
        isShow.value = false
    }
}, { immediate: true })

const toThis = (item, index) => {
    if (index === breadList.value.length - 1) {
        return
    } else {
        router.push(item.fullPath || item.path)
    }
}
</script>

<style lang="scss" scoped></style>
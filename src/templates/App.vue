<template>
  <div class="z-1 relative h-full">
    <div class="w-full h-full z-10 relative">
      <Sidebar/>
      <Header/>
      <div class="z-1 h-full pl-64 xl:pl-56 lg:pl-48 md:pl-0">
        <div class="w-full mx-auto text-neutral-800 py-8 px-8 xl:max-w-6xl lg:max-w-5xl md:pt-24 relative h-full">
          <transition name="fade" mode="out-in">
            <div class="h-full">
              <transition name="fade" mode="out-in" appear>
                <router-view/>
              </transition>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Sidebar from '@/components/layouts/Sidebar'
import Header from '@/components/layouts/Header'

export default {
  components: {Sidebar, Header},
  mounted() {
    let user_id = this.$store.getters.getUser.id;
    let app_id = process.env.VUE_APP_ONESIGNAL_ID;
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.setExternalUserId('usuario_id_' + user_id)
      OneSignal.init({
        appId: app_id,
      });
    });
  }
}
</script>

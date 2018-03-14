<template>
  <div class="page-demo">
    <comp :data="lineData" :percent-digit="6" ref="com"></comp>
  </div>
</template>

<script>
import Comp from '../src/component'

export default {
  name: 'Demo',

  data () {
    return {
      lineData: [
        {
          label: 'First',
          value: 1
        },
        {
          label: 'Second',
          value: 23
        },
        {
          label: 'Third',
          value: 123
        },
        {
          label: 'Forth',
          value: 111
        }
      ]
    }
  },

  mounted () {
    window.addEventListener('resize', () => {
      this.$refs.com.resize()
    })
  },

  components: { Comp }
}
</script>

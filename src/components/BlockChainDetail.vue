<template>
  <el-row class="tac">
    {{detail}}
  </el-row>
</template>

<script type="text/javascript">
  export default {
    name: "blockchaindetail",
    data() {
      return {
        detail: this.$route.params.detail
      }
    },
    created() {
    },
    methods: {

    }
  }
</script>
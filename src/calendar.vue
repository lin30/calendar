<template>
  <div class="cell_box v-calendar">
    <div class="cell_primary">
      <p style="font-size:0.15rem;">{{title}}</p>
    </div>
    <div class="cell_ft">
      <div style="text-align:right;" @touchstart="showPicker">
        <input :id="'name-box-' + uuid" class="cell_primary" value="请选择" style="border:none;text-align:right;font-size:0.14rem;color: #999999;" @input="getVal" readonly="readonly">
        <i class="icon-loan-more"></i>
      </div>
    </div>
    <div class="gearArea" v-show="show"></div>
  </div>
</template>

<script>
  import Picker from './picker.js'
  export default {
    name: 'c-picker',
    props: {
      title: {
        type: String,
        default: '年月'
      },
      location: {
        type: [String, Object]
      },
      column: {
        type: Number,
        default: 3
      },
      endTime: {
        type: Number,
        default: 2017
      },
      startTime: {
        type: Number,
        default: 1992
      }
    },
    data() {
      return {
        uuid: Math.random().toString(36).substring(3, 8),
        show: false
      }
    },
    watch: {
      location() {
        this.setLocation()
      }
    },
    mounted() {
      this.render()
      this.setLocation()
    },
    methods: {
      setLocation() {
        if (this.location) {
          this.picker.setLocation(this.location)
        } else {
          const Time = new Date()
          const Y = Time.getFullYear()
          const M = Time.getMonth() + 1
          const D = Time.getDate()
          var DateVal
          if (this.column === 1) {
            DateVal = `${Y}年`
          } else if (this.column === 2) {
            DateVal = `${Y}年 ${M}月`
          } else {
            DateVal = `${Y}年 ${M}月 ${D}日`
          }
          this.picker.setLocation({ date: DateVal, showDate: false })
        }
      },
      showPicker() {
        this.show = true
      },
      getVal(e) {
        this.show = false
        this.$emit('get-val', e.target.value, e.target.getAttribute('codeStr'))
      },
      render() {
        const _this = this
        this.picker = new Picker()
        this.picker.init({
          'trigger': `#name-box-${this.uuid}`,
          'startTime': _this.startTime,
          'endTime': _this.endTime,
          'column': _this.column
        })
      }
    }
  }

</script>

<style src="styles/components/calendar"></style>

### calendar组件
### Usage
```
  import calendar from 'components/calendar'
```
```
<calendar :start-time="start" :end-time="end" location="location" @get-date="getDate" :value="date"></calendar>
```
```
    data() {
        return {
        date: '请选择',
        start: 1980,
        end: 2020,
        location: '1999-1-5' 或 '2012年 9月 19日'
    }
```

### props
| 名字 | 类型 | 默认 | 描述
|:-|-|-|-|
|startTime|Number|1900|时间范围开始段
|endTime|Number|2050|时间范围结束段
|location|String|选定日期|同时设置默认的滚动位置和文本框右侧的值，格式为“2012年 9月 19日”;若不设置文本框右侧的值，则传{date：“2012年 9月 19日”，showDate：false}
|column|Number|3|显示的栏数，可选1,2,3
|title|String|开始时间|文本框左侧文本
|value|String|请选择|文本框右侧文本


### methods
|名字 |参数 |描述
|:-|-|-|
|getDate | 无 | 选择年月日后,返回选中值的回调函数

*示例*
```
    getDate(v) {
        this.date = v
      }
```
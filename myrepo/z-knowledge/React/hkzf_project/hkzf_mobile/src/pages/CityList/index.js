import React from 'react'
import { Toast } from 'antd-mobile';
import { getCityList, getHotCityList } from '../../api'
import { getCurrCity } from '../../utils'
import { List, AutoSizer } from 'react-virtualized';
import NavHeader from '../../components/NavHeader'
import styles from './index.module.css'


const TITLE_HEIGHT = 36
const NAME_HEIGHT = 50
const HOT_CITY = ['北京', '上海', '广州', '深圳']

function formatCityData (list) {
  const cityList = {}
  list.forEach(item => {
    let index = item.short.substring(0, 1)
    if (cityList[index]) {
      cityList[index].push(item)
    } else {
      cityList[index] = [item]
    }
  })
  const cityIndex = Object.keys(cityList).sort()
  return {
    cityList,
    cityIndex
  }
}

function formatCityIndex (letter) {
  switch (letter) {
    case '#':
      return '当前定位'
    case 'hot':
      return '热门城市'
    default:
      return letter.toUpperCase()
  }
}

export default class CityList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityList: {},
      cityIndex: [],
      activeIndex: 0
    }
    this.listComponent = React.createRef()
  }
  async getCityList () {
    Toast.loading('加载中...', 0, null, false)
    const { data: res } = await getCityList(1)
    const { data: hotCity } = await getHotCityList()
    Toast.hide()

    const { cityList, cityIndex } = formatCityData(res.body)
    cityList['hot'] = hotCity.body
    cityIndex.unshift('hot')

    const data = await getCurrCity()
    cityList['#'] = [data]
    cityIndex.unshift('#')

    this.setState(() => {
      return {
        cityList,
        cityIndex
      }
    })
  }


  async componentDidMount () {
    await this.getCityList()
    if (this.listComponent.current) {
      this.listComponent.current.measureAllRows()
    }
  }

  componentWillUnmount () {
    this.setState = (state, callback) => {
      return
    }
  }

  getRowHeight = ({ index }) => {
    let { cityIndex, cityList } = this.state;
    return cityList[cityIndex[index]].length * NAME_HEIGHT + TITLE_HEIGHT;
  }

  changeIndex = (index) => {
    this.listComponent.current.scrollToRow(index)
  }

  changeCity = (item) => {
    if (HOT_CITY.indexOf(item.label) > -1) {
      localStorage.setItem('hkzf_city', JSON.stringify({ label: item.label, value: item.value }))
      this.props.history.go(-1)
    } else {
      Toast.info('暂无房源信息', 1, null, false)
    }
  }

  rowRenderer = ({
    key,         // Unique key within array of rows
    index,       // 索引号
    isScrolling, // 当前项是否正在滚动中
    isVisible,   // 当前项在List中是可见的
    style        // 重点属性：一定要给每一个行数添加该样式
  }) => {
    const letter = this.state.cityIndex[index]
    return (
      <div
        key={key}
        style={style}
      // className={styles.city}
      >
        <div className={styles.title}>{formatCityIndex(letter)}</div>
        {this.state.cityList[letter].map(item => <div className={styles.name} key={item.value} onClick={() => { this.changeCity(item) }}>{item.label}</div>)}
      </div>
    )
  }

  renderCityIndex () {
    return this.state.cityIndex.map((item, index) => {
      return (
        <li className={styles.cityIndexItem} key={item} onClick={() => { this.changeIndex(index) }}>
          {/*判断一下，如果高亮状态的索引等于当前索引，那么就设置高亮样式*/}
          <span className={this.state.activeIndex === index ? styles.indexActive : ''}>{item === 'hot' ? '热' : item.toUpperCase()}</span>
        </li>
      )
    })
  }

  onRowsRendered = ({ startIndex }) => {
    if (startIndex !== this.state.activeIndex) {
      this.setState(() => {
        return {
          activeIndex: startIndex
        }
      })
    }
  }

  render () {
    return (
      <div className={styles.cityList}>
        <NavHeader className={styles.test}>城市选择</NavHeader>
        <AutoSizer>
          {({ width, height }) => (<List
            ref={this.listComponent}
            scrollToAlignment="start"
            // 组件的宽度
            width={width}
            // 组件的高度
            height={height}
            rowCount={this.state.cityIndex.length}
            // 每行的高度
            rowHeight={this.getRowHeight}
            rowRenderer={this.rowRenderer}
            onRowsRendered={this.onRowsRendered}
          />)}
        </AutoSizer>
        <ul className={styles.cityIndex}>
          {
            this.renderCityIndex()
          }
        </ul>
      </div>
    )
  }
}
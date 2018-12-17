import Http from "../../common/helper/http.js";
import Encrypt from "../../common/helper/encrypt.js";
const master = Http.url.master;
export default {
  data() {
    return {
      data2: [{
        id: 1,
        label: '经济发展',
        num:36
      }, {
        id: 2,
        label: '城市建设',
        num:17
      }, {
        id: 3,
        label: '道路交通',
        num:17
      }, {
        id: 4,
        label: '教育科技',
        num:21
      }, {
        id: 5,
        label: '民生服务',
        num:16
      }, {
        id: 6,
        label: '企业服务',
        num:109
      }, {
        id: 7,
        label: '健康卫生',
        num:32
      }, {
        id: 8,
        label: '资源环境',
        num:22
      }, {
        id: 9,
        label: '文体娱乐',
        num:24
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span>
            <span>{node.label}&nbsp;&nbsp;<span class="num">({data.num})</span></span>
          </span>
        </span>);
  }
      
  }
};

(function(){"use strict";var t={7877:function(t,e,n){var r=n(70),a=n(1836),o=n(2484);const s=r.ZP.create({baseURL:"http://127.0.0.1:3000/api",timeout:5e3});s.interceptors.request.use((t=>(t.headers["authorization"]=(0,a.L)(),t)),(t=>{console.log(t),Promise.reject(t)})),s.interceptors.response.use((t=>(200!=t.data.status&&o.Z.$message({message:t.data.msg,type:"error",duration:5e3}),401==t.data.status&&o.Z.$router.replace({name:"login"}),t)),(t=>(console.log("[响应拦截器]:"+t),o.Z.$message({message:t,type:"error",duration:5e3}),Promise.reject(t)))),e["Z"]=s},5738:function(t,e,n){n.d(e,{K5:function(){return a},QL:function(){return c},Sb:function(){return u},YG:function(){return i},el:function(){return l},o4:function(){return o},vy:function(){return s}});var r=n(7877);const a=t=>(0,r.Z)({url:"/store/getStock",method:"get",params:t}),o=t=>(0,r.Z)({url:"/store/getStoreOptions",method:"get",params:t}),s=t=>(0,r.Z)({url:"/store/getTransportStatusOptions",method:"get",params:t}),i=t=>(0,r.Z)({url:"/store/getStockRecording",method:"get",params:t}),l=t=>(0,r.Z)({url:"/store/inStore",method:"post",data:t}),u=t=>(0,r.Z)({url:"/store/outStore",method:"post",data:t}),c=t=>(0,r.Z)({url:"/store/addStore",method:"post",data:t})},2484:function(t,e,n){n.d(e,{Z:function(){return dt}});var r=n(7754),a=n.n(r),o=n(6369),s=function(){var t=this,e=t._self._c;return e("router-view")},i=[],l=n(2325),u={mounted(){this.$store.dispatch("user/getUserInfo"),l.WE.versions.mobile&&this.$router.replace({name:"agentFail"})}},c=u,d=n(1001),m=(0,d.Z)(c,s,i,!1,null,null,null),p=m.exports,f=n(2631),h=function(){var t=this,e=t._self._c;return e("el-container",{staticClass:"warper"},[e("el-header",{staticClass:"header",attrs:{height:"70px"}},[e("div",{staticClass:"collapse-btn",on:{click:function(e){t.isCollapse=!t.isCollapse}}},[e("i",{staticClass:"el-icon-s-unfold"})]),e("div",{staticClass:"logo"},[t._v("库存后台管理系统")]),e("div",{staticClass:"header-user-con"},[e("el-avatar",{staticClass:"user-avatar"},[t._v(" user ")]),e("el-dropdown",{staticClass:"user-name"},[e("span",{staticClass:"el-dropdown-link"},[t._v(" "+t._s(t.nick)),e("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),e("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[e("el-dropdown-item",[t._v("个人中心")]),e("el-dropdown-item",[t._v("退出登陆")])],1)],1)],1)]),e("el-container",[e("el-aside",{staticStyle:{"background-color":"#324157",overflow:"hidden",width:"150px"}},[e("Sidebar",{staticClass:"sidebar-container"})],1),e("el-container",[e("el-header",[e("MainHeader")],1),e("el-main",[e("AppMain")],1)],1)],1)],1)},g=[],v=function(){var t=this,e=t._self._c;return e("transition",{attrs:{name:"el-zoom-in-center",mode:"out-in"}},[e("router-view")],1)},b=[],w={name:"index"},y=w,x=(0,d.Z)(y,v,b,!1,null,null,null),C=x.exports,_=function(){var t=this,e=t._self._c;return e("el-menu",{staticClass:"el-menu",attrs:{"default-active":t.$route.path,"background-color":"#324157","text-color":"#fff","active-text-color":"#ffd04b",router:!0}},[e("el-menu-item",{attrs:{index:"/home/index"}},[e("i",{staticClass:"el-icon-s-home"}),e("span",{attrs:{slot:"title"},slot:"title"},[t._v("首页")])]),e("el-menu-item",{attrs:{index:"/home/store"}},[e("i",{staticClass:"el-icon-box"}),e("span",{attrs:{slot:"title"},slot:"title"},[t._v("库存")])]),e("el-submenu",{attrs:{index:"/home/storeIn"}},[e("template",{slot:"title"},[e("i",{staticClass:"el-icon-sell"}),e("span",[t._v("入库")])]),e("el-menu-item-group",[e("el-menu-item",{attrs:{index:"/home/storeIn/add"}},[t._v("添加入库")]),e("el-menu-item",{attrs:{index:"/home/storeIn/recording"}},[t._v("入库记录")])],1)],2),e("el-submenu",{attrs:{index:"/home/storeOut"}},[e("template",{slot:"title"},[e("i",{staticClass:"el-icon-sold-out"}),e("span",[t._v("出库")])]),e("el-menu-item-group",[e("el-menu-item",{attrs:{index:"/home/storeOut/add"}},[t._v("添加出库")]),e("el-menu-item",{attrs:{index:"/home/storeOut/recording"}},[t._v("出库记录")])],1)],2),e("el-menu-item",{attrs:{index:"/home/setting"}},[e("i",{staticClass:"el-icon-setting"}),e("span",{attrs:{slot:"title"},slot:"title"},[t._v("设置")])])],1)},O=[],k={name:"Sidebar",methods:{},mounted(){console.log(this.$attrs)}},S=k,Z=(0,d.Z)(S,_,O,!1,null,null,null),$=Z.exports,L=function(){var t=this,e=t._self._c;return e("Breadcrumb")},M=[],P=function(){var t=this,e=t._self._c;return e("el-breadcrumb",{staticClass:"app-breadcrumb",attrs:{separator:">"}},[e("transition-group",{attrs:{name:"breadcrumb"}},t._l(t.levelList,(function(n,r){return e("el-breadcrumb-item",{key:n.path},["noRedirect"===n.redirect||r==t.levelList.length-1?e("span",{staticClass:"no-redirect"},[t._v(t._s(n.meta.title))]):e("a",{on:{click:function(e){return e.preventDefault(),t.handleLink(n)}}},[t._v(t._s(n.meta.title))])])})),1)],1)},E=[],A=(n(7658),n(3785)),I={data(){return{levelList:null}},watch:{$route(t){t.path.startsWith("/redirect/")||this.getBreadcrumb()}},created(){this.getBreadcrumb()},methods:{getBreadcrumb(){let t=this.$route.matched.filter((t=>t.meta&&t.meta.title));const e=t[0];this.isDashboard(e)||(t=[{path:"/home",meta:{title:"当前位置"}}].concat(t)),this.levelList=t.filter((t=>t.meta&&t.meta.title&&!1!==t.meta.breadcrumb))},isDashboard(t){const e=t&&t.name;return!!e&&e.trim().toLocaleLowerCase()==="Dashboard".toLocaleLowerCase()},pathCompile(t){const{params:e}=this.$route;var n=A["default"].compile(t);return n(e)},handleLink(t){const{redirect:e,path:n}=t;e?this.$router.push(e):this.$router.push(this.pathCompile(n))}}},T=I,D=(0,d.Z)(T,P,E,!1,null,"34501b0f",null),j=D.exports,q={components:{Breadcrumb:j}},U=q,B=(0,d.Z)(U,L,M,!1,null,null,null),F=B.exports,R=n(3822),K={components:{Sidebar:$,AppMain:C,MainHeader:F},data:function(){return{isCollapse:!1}},mounted(){this.$store.dispatch("store/getStoreOptions"),this.$store.dispatch("store/getTransportStatusOptions")},computed:{...(0,R.rn)("user",{nick:t=>t.userInfo.nick})}},N=K,H=(0,d.Z)(N,h,g,!1,null,"247d2f5c",null),W=H.exports,z=function(){var t=this,e=t._self._c;return e("div",{staticClass:"warpper"},[e("div",{staticClass:"login-container"},[e("div",{staticClass:"ms-title"},[t._v("库存管理系统")]),e("el-form",{staticClass:"form",attrs:{model:t.form,rules:{account:[{required:!0,message:"请输入用户名",trigger:"blur"}],passward:[{required:!0,message:"请输入密码",trigger:"blur"}]}}},[e("el-form-item",{staticClass:"form-item",attrs:{prop:"account"}},[e("el-input",{staticClass:"item-input",model:{value:t.form.account,callback:function(e){t.$set(t.form,"account",e)},expression:"form.account"}},[e("template",{slot:"prepend"},[e("i",{staticClass:"el-icon-user"})])],2)],1),e("el-form-item",{staticClass:"form-item",attrs:{prop:"passward"}},[e("el-input",{staticClass:"item-input",model:{value:t.form.passward,callback:function(e){t.$set(t.form,"passward",e)},expression:"form.passward"}},[e("template",{slot:"prepend"},[e("i",{staticClass:"el-icon-lock"})])],2)],1),e("el-form-item",{staticClass:"form-item"},[e("el-button",{staticClass:"login-button",attrs:{type:"primary",round:""},on:{click:t.login}},[t._v("登陆")])],1)],1)],1)])},Q=[],X={data:function(){return{form:{}}},methods:{login:async function(){let t=await this.$store.dispatch("user/login",this.form);200==t.data.status&&(this.$message.success(t.data.msg),this.$router.push({name:"home"}))}}},G=X,Y=(0,d.Z)(G,z,Q,!1,null,"5151ece0",null),V=Y.exports,J=n(1836);o["default"].use(f.ZP);const tt=new f.ZP({routes:[{path:"*",redirect:"/home"},{path:"/login",name:"login",component:V},{path:"/home",name:"home",redirect:"/home/index",component:W,children:[{path:"index",name:"index",component:()=>n.e(76).then(n.bind(n,9076)),meta:{title:"首页"}},{path:"store",name:"store",component:()=>n.e(881).then(n.bind(n,9881)),meta:{title:"库存"}},{path:"storeIn",name:"storeIn",component:()=>n.e(563).then(n.bind(n,2563)),meta:{title:"入库"},children:[{path:"add",name:"add",component:()=>n.e(477).then(n.bind(n,5477)),meta:{title:"添加入库"}},{path:"recording",name:"recording",component:()=>n.e(276).then(n.bind(n,7276)),meta:{title:"入库记录"}}]},{path:"storeOut",name:"storeOut",component:()=>n.e(271).then(n.bind(n,6271)),meta:{title:"出库"},children:[{path:"add",name:"add",component:()=>n.e(101).then(n.bind(n,1101)),meta:{title:"添加出库"}},{path:"recording",name:"recording",component:()=>n.e(496).then(n.bind(n,1496)),meta:{title:"出库记录"}}]},{path:"setting",name:"setting",component:()=>n.e(78).then(n.bind(n,6078)),meta:{title:"设置"}}]},{path:"/agentFail",name:"agentFail",component:()=>n.e(892).then(n.bind(n,9892))}]});tt.beforeEach(((t,e,n)=>{if("/login"!=t.matched[0].path){let t=(0,J.L)();t?n():n({name:"login"})}else n()}));var et=tt,nt=n(7877);const rt=t=>(0,nt.Z)({url:"/user/login",method:"post",data:t}),at=()=>(0,nt.Z)({url:"/user/getUserInfo",method:"get"});var ot={namespaced:!0,state:{userInfo:{}},actions:{async login({commit:t},e){let n=await rt(e);return 200==n.data.status&&(t("upDataUserInfo",n.data.data),(0,J.o)(n.data.data.token)),n},async getUserInfo({commit:t},e){let n=await at();return 200==n.data.status&&(t("upDataUserInfo",n.data.data),(0,J.o)(n.data.data.token)),n}},mutations:{upDataUserInfo(t,e){t.userInfo=e}},getters:{}},st=n(5738),it={namespaced:!0,state:{stock:[],storeOptions:[],transportStatusOptions:[]},actions:{async getStock({commit:t},e){let n=await(0,st.K5)(e);return 200==n.data.status&&t("upDataStock",n.data),n},async getStoreOptions({commit:t},e){let n=await(0,st.o4)(e);return 200==n.data.status&&t("upDataStoreOptions",n.data.data),n},async getTransportStatusOptions({commit:t},e){let n=await(0,st.vy)(e);return 200==n.data.status&&t("upDataTransportStatusOptions",n.data.data),n}},mutations:{upDataStock(t,e){t.stock=e},upDataStoreOptions(t,e){t.storeOptions=(0,l.Xy)(e)},upDataTransportStatusOptions(t,e){console.log(this),t.transportStatusOptions=e}},getters:{}};o["default"].use(R.ZP);var lt=new R.ZP.Store({modules:{user:ot,store:it}}),ut=n(3139);o["default"].config.productionTip=!0,o["default"].use(a()),o["default"].prototype.$echarts=ut,n.e(793).then(n.bind(n,8793));var ct=new o["default"]({store:lt,router:et,render:t=>t(p)}).$mount("#app"),dt=ct},1836:function(t,e,n){n.d(e,{L:function(){return r},o:function(){return a}}),console.log(window);const r=()=>n.g.localStorage.getItem("authorization"),a=t=>n.g.localStorage.setItem("authorization",t)},2325:function(t,e,n){n.d(e,{WE:function(){return o},Xy:function(){return a},p6:function(){return r}});n(7658);const r=(t,e="yyyy-MM-dd hh:mm:ss")=>{var n={"M+":t.getMonth()+1,"d+":t.getDate(),"h+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds(),"q+":Math.floor((t.getMonth()+3)/3),S:t.getMilliseconds()};if(!t||null==t)return null;for(var r in/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(t.getFullYear()+"").substr(4-RegExp.$1.length))),n)new RegExp("("+r+")").test(e)&&(e=e.replace(RegExp.$1,1===RegExp.$1.length?n[r]:("00"+n[r]).substr((""+n[r]).length)));return e},a=t=>{let e={},n=[];for(let r of t)if(e[r.name]){let t=e[r.name].index;n[t].children.push({value:r.type,label:r.type,stock_id:r.id})}else{let t=n.push({value:r.name,label:r.name,children:[{value:r.type,label:r.type,stock_id:r.id}]})-1;e[r.name]={name:r.name,index:t}}return n},o={versions:function(){var t=navigator.userAgent;navigator.appVersion;return{trident:t.indexOf("Trident")>-1,presto:t.indexOf("Presto")>-1,webKit:t.indexOf("AppleWebKit")>-1,gecko:t.indexOf("Gecko")>-1&&-1==t.indexOf("KHTML"),mobile:!!t.match(/AppleWebKit.*Mobile.*/),ios:!!t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),android:t.indexOf("Android")>-1||t.indexOf("Adr")>-1,iPhone:t.indexOf("iPhone")>-1,iPad:t.indexOf("iPad")>-1,webApp:-1==t.indexOf("Safari"),weixin:t.indexOf("MicroMessenger")>-1,qq:" qq"==t.match(/\sQQ/i)}}(),language:(navigator.browserLanguage||navigator.language).toLowerCase()}}},e={};function n(r){var a=e[r];if(void 0!==a)return a.exports;var o=e[r]={exports:{}};return t[r].call(o.exports,o,o.exports,n),o.exports}n.m=t,function(){var t=[];n.O=function(e,r,a,o){if(!r){var s=1/0;for(c=0;c<t.length;c++){r=t[c][0],a=t[c][1],o=t[c][2];for(var i=!0,l=0;l<r.length;l++)(!1&o||s>=o)&&Object.keys(n.O).every((function(t){return n.O[t](r[l])}))?r.splice(l--,1):(i=!1,o<s&&(s=o));if(i){t.splice(c--,1);var u=a();void 0!==u&&(e=u)}}return e}o=o||0;for(var c=t.length;c>0&&t[c-1][2]>o;c--)t[c]=t[c-1];t[c]=[r,a,o]}}(),function(){n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,{a:e}),e}}(),function(){n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})}}(),function(){n.f={},n.e=function(t){return Promise.all(Object.keys(n.f).reduce((function(e,r){return n.f[r](t,e),e}),[]))}}(),function(){n.u=function(t){return"js/"+t+"."+{76:"a4df5f50",78:"479b8173",101:"ee4fe89a",271:"aa776074",276:"5e02889b",477:"8a60b054",496:"a21110d5",563:"65bcce80",793:"05400e84",881:"076823f4",892:"5e75da69"}[t]+".js"}}(),function(){n.miniCssF=function(t){return"css/"+t+"."+{76:"8848a344",101:"d92cb3a2",276:"028f1022",477:"56776956",496:"028f1022",793:"c0769954",881:"405e7bee"}[t]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={},e="wms-client:";n.l=function(r,a,o,s){if(t[r])t[r].push(a);else{var i,l;if(void 0!==o)for(var u=document.getElementsByTagName("script"),c=0;c<u.length;c++){var d=u[c];if(d.getAttribute("src")==r||d.getAttribute("data-webpack")==e+o){i=d;break}}i||(l=!0,i=document.createElement("script"),i.charset="utf-8",i.timeout=120,n.nc&&i.setAttribute("nonce",n.nc),i.setAttribute("data-webpack",e+o),i.src=r),t[r]=[a];var m=function(e,n){i.onerror=i.onload=null,clearTimeout(p);var a=t[r];if(delete t[r],i.parentNode&&i.parentNode.removeChild(i),a&&a.forEach((function(t){return t(n)})),e)return e(n)},p=setTimeout(m.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=m.bind(null,i.onerror),i.onload=m.bind(null,i.onload),l&&document.head.appendChild(i)}}}(),function(){n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){var t=function(t,e,n,r){var a=document.createElement("link");a.rel="stylesheet",a.type="text/css";var o=function(o){if(a.onerror=a.onload=null,"load"===o.type)n();else{var s=o&&("load"===o.type?"missing":o.type),i=o&&o.target&&o.target.href||e,l=new Error("Loading CSS chunk "+t+" failed.\n("+i+")");l.code="CSS_CHUNK_LOAD_FAILED",l.type=s,l.request=i,a.parentNode.removeChild(a),r(l)}};return a.onerror=a.onload=o,a.href=e,document.head.appendChild(a),a},e=function(t,e){for(var n=document.getElementsByTagName("link"),r=0;r<n.length;r++){var a=n[r],o=a.getAttribute("data-href")||a.getAttribute("href");if("stylesheet"===a.rel&&(o===t||o===e))return a}var s=document.getElementsByTagName("style");for(r=0;r<s.length;r++){a=s[r],o=a.getAttribute("data-href");if(o===t||o===e)return a}},r=function(r){return new Promise((function(a,o){var s=n.miniCssF(r),i=n.p+s;if(e(s,i))return a();t(r,i,a,o)}))},a={143:0};n.f.miniCss=function(t,e){var n={76:1,101:1,276:1,477:1,496:1,793:1,881:1};a[t]?e.push(a[t]):0!==a[t]&&n[t]&&e.push(a[t]=r(t).then((function(){a[t]=0}),(function(e){throw delete a[t],e})))}}(),function(){var t={143:0};n.f.j=function(e,r){var a=n.o(t,e)?t[e]:void 0;if(0!==a)if(a)r.push(a[2]);else{var o=new Promise((function(n,r){a=t[e]=[n,r]}));r.push(a[2]=o);var s=n.p+n.u(e),i=new Error,l=function(r){if(n.o(t,e)&&(a=t[e],0!==a&&(t[e]=void 0),a)){var o=r&&("load"===r.type?"missing":r.type),s=r&&r.target&&r.target.src;i.message="Loading chunk "+e+" failed.\n("+o+": "+s+")",i.name="ChunkLoadError",i.type=o,i.request=s,a[1](i)}};n.l(s,l,"chunk-"+e,e)}},n.O.j=function(e){return 0===t[e]};var e=function(e,r){var a,o,s=r[0],i=r[1],l=r[2],u=0;if(s.some((function(e){return 0!==t[e]}))){for(a in i)n.o(i,a)&&(n.m[a]=i[a]);if(l)var c=l(n)}for(e&&e(r);u<s.length;u++)o=s[u],n.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return n.O(c)},r=self["webpackChunkwms_client"]=self["webpackChunkwms_client"]||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))}();var r=n.O(void 0,[998],(function(){return n(2484)}));r=n.O(r)})();
//# sourceMappingURL=app.58be333c.js.map
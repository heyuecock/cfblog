/**------【①.谋而后定：配置区】-----**/

'use strict';

// 我们将在请求处理函数中加载环境变量
const ACCOUNT = { //账号相关，安全性更高
  "user" : "", // 将在请求处理时动态获取
  "password" : "", // 将在请求处理时动态获取
  "third_token" : "", // 将在请求处理时动态获取
  "cacheZoneId": "", // 将在请求处理时动态获取
  "cacheToken": "", // 将在请求处理时动态获取

  "kv_var": this['CFBLOG'],//workers绑定kv时用的变量名
}

const OPT = { //网站配置

  /*--前台参数--*/
  "siteDomain" : "example.com",// 域名(不带https 也不带/)
  "siteName" : "CFBLOG-Plus",//博客名称
  "siteDescription":"CFBLOG-Plus" ,//博客描述
  "keyWords":"cloudflare,KV,workers,blog",//关键字
  "logo":"https://cdn.jsdelivr.net/gh/Arronlong/cfblog-plus@master/themes/JustNews/files/logo2.png",//JustNews主题的logo

  "theme_github_path":"https://cdn.jsdelivr.net/gh/Arronlong/cfblog-plus@master/themes/",//主题路径
  "themeURL" : "https://raw.githubusercontent.com/Arronlong/cfblog-plus/master/themes/JustNews/", // 模板地址,以 "/"" 结尾
  //"search_xml_url":"", //search.xml外部链接，可通过github的action自动生成，不设置则实时生成
  //"sitemap_xml_url":"", //sitemap.xml外部链接，可通过github的action自动生成，不设置则实时生成
  
  "pageSize" : 5,//每页文章数
  "recentlySize" : 6,//最近文章数
  "recentlyType" : 1,//最近文章类型：1-按创建时间倒序（按id倒序），2-按修改时间排序
  "readMoreLength":150,//阅读更多截取长度
  "cacheTime" : 60*60*24*2, //文章在浏览器的缓存时长(秒),建议=文章更新频率
  "html404" : `<b>404</b>`,//404页面代码
  "codeBeforHead":`
  <script src="https://cdn.staticfile.org/jquery/2.2.4/jquery.min.js"></script>
  <style>
  /* 优化后的复制按钮样式 */
  .copy-button {
    position: absolute;
    top: 5px;
    right: 5px;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.1);
    color: #666;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s;
    opacity: 0;
    z-index: 10;
  }

  pre:hover .copy-button {
    opacity: 1;
  }

  .copy-button:hover {
    background-color: rgba(0, 0, 0, 0.2);
    color: #333;
  }

  .copy-button.success {
    background-color: #28a745;
    color: white;
  }

  .copy-button.error {
    background-color: #dc3545;
    color: white;
  }

  pre {
    position: relative;
    overflow: auto;
    padding: 16px;
    border-radius: 4px;
  }

  pre code {
    display: block;
    overflow-x: auto;
    padding: 0;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
  }
  </style>
  `,//其他代码,显示在</head>前
  "codeBeforBody":`
  <script>
  document.addEventListener('DOMContentLoaded', function() {
    // 为所有代码块添加复制按钮
    const codeBlocks = document.querySelectorAll('pre code');
    
    if (codeBlocks.length > 0) {
      codeBlocks.forEach(function(codeBlock, index) {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.setAttribute('aria-label', '复制代码');
        copyButton.innerHTML = '<span>复制</span>';
        
        // 为了防止多个代码块id冲突，添加唯一id
        const preElement = codeBlock.parentNode;
        preElement.id = 'code-block-' + index;
        
        // 添加按钮到pre元素
        preElement.appendChild(copyButton);
        
        // 添加点击事件处理
        copyButton.addEventListener('click', function(e) {
          e.preventDefault();
          
          // 获取代码内容，过滤掉行号等非代码内容
          let code = codeBlock.textContent || '';
          
          // 复制到剪贴板
          const copyText = async () => {
            try {
              await navigator.clipboard.writeText(code);
              
              // 修改按钮样式和文本表示复制成功
              copyButton.classList.add('success');
              copyButton.innerHTML = '<span>已复制!</span>';
              
              // 2秒后恢复原样
              setTimeout(() => {
                copyButton.classList.remove('success');
                copyButton.innerHTML = '<span>复制</span>';
              }, 2000);
            } catch (err) {
              console.error('复制失败:', err);
              
              // 处理复制失败情况
              copyButton.classList.add('error');
              copyButton.innerHTML = '<span>复制失败</span>';
              
              // 2秒后恢复原样
              setTimeout(() => {
                copyButton.classList.remove('error');
                copyButton.innerHTML = '<span>复制</span>';
              }, 2000);
              
              // 兼容性备用方案
              const textarea = document.createElement('textarea');
              textarea.value = code;
              textarea.style.position = 'fixed';
              textarea.style.opacity = '0';
              document.body.appendChild(textarea);
              textarea.select();
              
              try {
                document.execCommand('copy');
                copyButton.classList.remove('error');
                copyButton.classList.add('success');
                copyButton.innerHTML = '<span>已复制!</span>';
              } catch (e) {
                copyButton.innerHTML = '<span>请手动复制</span>';
              }
              
              document.body.removeChild(textarea);
              
              setTimeout(() => {
                copyButton.classList.remove('success', 'error');
                copyButton.innerHTML = '<span>复制</span>';
              }, 2000);
            }
          };
          
          copyText();
        });
      });
    }
  });
  </script>
  `,//其他代码,显示在</body>前
  "commentCode":`
  <script>
    //文章浏览页 添加编辑直达功能
    $(".entry-info").append('<a style="float:right;margin-left:5px;" href="'+location.href.replace('/article/','/admin/edit/')+'" target="_blank">编辑</a>')
  </script>
  `,//评论区代码
  "widgetOther":`
  `,//20201224新增参数,用于右侧 小部件扩展
  "otherCodeA":`热度`,//模板开发用的其他自定义变量
  "otherCodeB":``,//
  "otherCodeC":``,//
  "otherCodeD":``,//
  "otherCodeE":``,//
  "copyRight" :`Powered by <a href="https://www.cloudflare.com">Cloudflare</a> & <a href="https://blog.arrontg.cf">CFBlog-Plus</a> & <a href="https://blog.gezhong.vip">CF-Blog </a>`,//自定义版权信息,建议保留大公无私的 Coudflare 和 作者 的链接
  "robots":`User-agent: *
Disallow: /admin`,//robots.txt设置
  
  /*--前后台共用参数--*/
  
  "top_flag":`<topflag>[置顶]</topflag>`,//置顶标志
  "top_flag_style":`<style>topflag {color:#ff5722}</style>`,//置顶标志的样式


  /*--后台参数--*/

  "hidden_flag":`<hiddenflag>[隐藏]</hiddenflag>`,//隐藏标志
  "hidden_flag_style":`<style>hiddenflag {color:#000000;background-color: #ffff00;}</style>`,//隐藏标志的样式
  
  "admin_home_idx": 1, //后台首页tab索引设置：1-我的文章,2-新建,3-设置,4-发布
  "editor_page_scripts": `
    //置顶设置
    let top_setting=\`
      <div class="form-group">
      <label for="exampleInputEmail2">是否置顶</label>
      <input type="hidden" class="form-control" id="top_timestamp" name="top_timestamp">
      <select class="form-control" id="istop" name="istop">
        <option value="0" selected >否</option>
        <option value="1" >是</option>
      </select>
      </div>\`
    $('form#addNewForm div.form-group,form#editForm div.form-group').last().after(top_setting);//新建和编辑页面添加置顶设置
    $("#istop").change(function(){
      $("#top_timestamp").val($(this).val()*1?new Date().getTime():0);
    });
    if(location.pathname.startsWith('/admin/edit')){//修改文章页面，自动设置置顶
      $("#istop").val(articleJson.top_timestamp?1:0);
      $("#top_timestamp").val(articleJson.top_timestamp?articleJson.top_timestamp:0);
    }
    $("#istop").trigger('change')
    
    //隐藏设置
    let hidden_setting=\`
      <div class="form-group">
      <label for="exampleInputEmail2">是否隐藏</label>
      <select class="form-control" id="hidden" name="hidden">
        <option value="0" selected >否</option>
        <option value="1" >是</option>
      </select>
      </div>\`
    $('form#addNewForm div.form-group,form#editForm div.form-group').last().after(hidden_setting);//新建和编辑页面添加隐藏设置
    if(location.pathname.startsWith('/admin/edit')){//修改文章页面，自动设置隐藏
      $("#hidden").val(articleJson.hidden?1:0);
      
      // 只在编辑页面添加删除按钮
      let delete_btn = $('<button type="button" class="btn btn-danger" style="margin-left:10px;">删除文章</button>');
      $('.btn-primary').after(delete_btn);
      
      // 添加删除功能
      delete_btn.click(function(e) {
        e.preventDefault();
        if(confirm('确定要删除这篇文章吗？此操作不可恢复！')) {
          $(this).prop('disabled', true).text('删除中...');
          
          fetch('/admin/delete/' + articleJson.id, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          })
          .then(response => response.json())
          .then(data => {
            if(data.status === 'success') {
              alert('文章删除成功！');
              // 修改这里：跳转到文章列表标签页
              window.location.replace('/admin/#list');
            } else {
              alert('删除失败：' + (data.message || '未知错误'));
              $(this).prop('disabled', false).text('删除文章');
            }
          })
          .catch(error => {
            console.error('删除文章时出错:', error);
            alert('删除文章时出错，请查看控制台');
            $(this).prop('disabled', false).text('删除文章');
          });
        }
      });
    }
    
    let sitemapxml=\`<a  tabindex="0"  role="button"  type="submit" id="btn_export" class="btn btn-default"  href="/admin/sitemap.xml" >导出sitemap.xml</a>\`
    $('form#importForm a').last().after(sitemapxml);//设置页面添加导出sitemap.xml导出按钮
    let searchxml=\`<a  tabindex="0"  role="button"  type="submit" id="btn_export" class="btn btn-default"  href="/admin/search.xml" >导出search.xml</a>\`
    $('form#importForm a').last().after(searchxml);//设置页面添加导出search.xml导出按钮
    
    //关闭email匹配和@匹配，否则图片使用jsdelivr的cdn，如果有版本号会匹配成"mailto:xxx"从而导致显示异常
    mdEditor.settings.emailLink=false;
    mdEditor.settings.atLink=false;

    //默认图片，工具：https://tool.lu/imageholder/
    if($('#img').val()=="")$('#img').val('https://cdn.jsdelivr.net/gh/Arronlong/cdn@master/cfblog/cfblog-plus.png');
    //默认时间设置为当前时间
    if($('#createDate').val()=="")$('#createDate').val(new Date(new Date().getTime()+8*60*60*1000).toJSON().substr(0,16));
`, //后台编辑页面脚本

};

//---对部分配置进行处理---
{
  //CFBLOG 通用变量
  this.CFBLOG = ACCOUNT.kv_var;
  
  //默认为非私密博客
  if(null==OPT.privateBlog){
    OPT.privateBlog=false;
  }
  //处理themeURL、theme_github_path参数设定
  if(OPT.themeURL.substr(-1)!='/'){
    OPT.themeURL=OPT.themeURL+'/';
  }
  if(OPT.theme_github_path.substr(-1)!='/'){
    OPT.theme_github_path=OPT.theme_github_path+'/';
  }
  //置顶样式对于前台来说，与codeBeforHead结合即可
  if(OPT.top_flag_style){
  OPT.codeBeforHead += OPT.top_flag_style
  }
}

/**------【②.猎杀时刻：请求处理入口】-----**/

//监听请求
addEventListener("fetch", event => {
  // 从环境变量加载敏感配置
  loadEnvVariables();
  
  // 处理请求
  event.respondWith(handlerRequest(event));
});

// 从环境变量加载配置
function loadEnvVariables() {
  try {
    // 在Cloudflare Workers中，环境变量可以直接访问
    ACCOUNT.user = BLOG_USER || "";
    ACCOUNT.password = BLOG_PASSWORD || "";
    ACCOUNT.third_token = BLOG_THIRD_TOKEN || "";
    ACCOUNT.cacheZoneId = BLOG_CACHE_ZONE_ID || "";
    ACCOUNT.cacheToken = BLOG_CACHE_TOKEN || "";
    
    console.log("环境变量加载成功");
  } catch (e) {
    console.error("环境变量加载失败", e);
  }
}

// 处理请求
async function handlerRequest(event){
  let request = event.request
  //获取url请求对象
  let url = new URL(request.url)
  let paths = url.pathname.trim("/").split("/")

  // 处理登录页面请求
  if (paths[0] === "login") {
    return await handle_login(request);
  }

  // 修改校验权限的逻辑
  if (("admin" == paths[0] || true === OPT.privateBlog)) {
    // 检查cookie中的auth令牌
    const cookies = request.headers.get('Cookie') || '';
    let authToken = '';
    
    cookies.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name === 'auth') {
        authToken = value;
      }
    });
    
    // 如果有auth令牌，添加到请求头
    if (authToken) {
      const newHeaders = new Headers(request.headers);
      newHeaders.set('Authorization', 'Basic ' + authToken);
      request = new Request(request.url, {
        method: request.method,
        headers: newHeaders,
        body: request.body
      });
    }
    
    // 如果认证失败，重定向到登录页
    if (!parseBasicAuth(request)) {
      return new Response("Redirecting to login...", {
        status: 302,
        headers: {
          "Location": "/login"
        }
      });
    }
  }

  //组装请求url，查看是否有缓存
  const D=caches.default,
      M="https://"+OPT.siteDomain+url.pathname,
      x=new Request(M, request);
  console.log("cacheFullPath:",M);
  let k=await D.match(x);
  if(k){
    console.log("hit cache!")
    return k;
  }

  switch(paths[0]){
    case "favicon.ico": //图标
      k = await handle_favicon(request);
      break;
    case "robots.txt":
      k = await handle_robots(request);
      break;
    case "sitemap.xml":
      k = await handle_sitemap(request);
      break;
    case "search.xml":
      k = await handle_search(request);
      break;
    case "admin": //后台
      k = await handle_admin(request);
      break;
    case "article": //文章内容页
      k = await handle_article(paths[1]);
      break;
    case "": //文章 首页
    case "page": //文章 分页
    case "category": //分类 分页
    case "tags": //标签 分页
      k = await renderBlog(url);
      break;
    default:
      //其他页面返回404
      k= new Response(OPT.html404,{
        headers:{
          "content-type":"text/html;charset=UTF-8"
        },
        status:200
      })
      break;
  }  
  //设置浏览器缓存时间:后台不缓存、只缓存前台
  try{
    if("admin"==paths[0]){
      k.headers.set("Cache-Control","no-store")
    }else{
      k.headers.set("Cache-Control","public, max-age="+OPT.cacheTime),
      event.waitUntil(D.put(M,k.clone()))
    }
  }catch(e){}
  
  return k
}

/**------【③.分而治之：各种请求分开处理】-----**/

//访问: favicon.ico
async function handle_favicon(request){
  /*
  想要自定义，或者用指定的ico，可将此请求置为404，并在codeBeforHead中自行添加类似代码：
    <link rel="icon" type="image/x-icon" href="https://cdn.jsdelivr.net/gh/gdtool/zhaopp/cfblog/favicon.ico" />
    <link rel="Shortcut Icon" href="https://cdn.jsdelivr.net/gh/gdtool/zhaopp/cfblog/favicon.ico">
  */
  /*
  return new Response("404",{
      headers:{
          "content-type":"text/plain;charset=UTF-8"
      },
      status:404
  });
  */
  let url = new URL(request.url)
  url.host="dash.cloudflare.com"
  return await fetch(new Request(url, request));
}

//访问: robots.txt
async function handle_robots(request){
  return new Response(OPT.robots+"\nSitemap: https://"+OPT.siteDomain+"/sitemap.xml",{
    headers:{
      "content-type":"text/plain;charset=UTF-8"
    },
    status:200
  });
}

//访问: sitemap.xml
async function handle_sitemap(request){
  //如果设置了参数，则使用参数指定的url
  //可使用github action方式自动定期更新
  let xml;
  if(OPT.sitemap_xml_url){
    
    //cf代理方式，速度可以，实时性更好
    let url = new URL(request.url)
    url.href = OPT.sitemap_xml_url.replace('cdn.jsdelivr.net/gh','raw.githubusercontent.com').replace('@','/');
    xml = await fetch(new Request(url, request));
    xml = await xml.text();
    
    ////302方式，如果使用jsdelivr作为cdn，速度快，但更新有延迟
    //return new Response("",{
    //    headers:{
    //        "location":OPT.sitemap_xml_url
    //    },
    //    status:302
    //});
  
  }else{ //未配置参数，则实时获取结构
  
    //读取文章列表，并按照特定的xml格式进行组装
    let articles_all=await getArticlesList()
    xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for(var i=0;i<articles_all.length;i++){
      xml+="\n\t<url>",
      xml+="\n\t\t<loc>https://"+OPT.siteDomain+"/article/"+articles_all[i].id+"/"+articles_all[i].link+".html</loc>",
      xml+="\n\t\t<lastmod>"+articles_all[i].createDate.substr(0,10)+"</lastmod>",
      xml+="\n\t\t<changefreq>"+(void 0===articles_all[i].changefreq?"daily":articles_all[i].changefreq)+"</changefreq>",
      xml+="\n\t\t<priority>"+(void 0===articles_all[i].priority?"0.5":articles_all[i].priority)+"</priority>",
      xml+="\n\t</url>";
    }
    xml+="\n</urlset>"
  }
  return new Response(xml,{
    headers:{
        "content-type":"text/xml;charset=UTF-8"
    },
    status:200
  });
}

//访问: search.xml
async function handle_search(request){
  //如果设置了参数，则使用参数指定的url
  //可使用github action方式自动定期更新
  let xml;
  if(OPT.search_xml_url){
    
    //cf代理方式，速度可以，实时性更好
    let url = new URL(request.url)
    url.href = OPT.search_xml_url.replace('cdn.jsdelivr.net/gh','raw.githubusercontent.com').replace('@','/');
    xml = await fetch(new Request(url, request));
    xml = await xml.text();
    
    ////302方式，如果使用jsdelivr作为cdn，速度快，但更新有延迟
    //return new Response("",{
    //    headers:{
    //        "location":OPT.search_xml_url
    //    },
    //    status:302
    //});
  
  }else{ //未配置参数，则实时获取结构
  
    //读取文章列表，并按照特定的xml格式进行组装
    let articles_all=await getArticlesList()
    xml='<?xml version="1.0" encoding="UTF-8"?>\n<blogs>';
    for(var i=0;i<articles_all.length;i++){
      xml+="\n\t<blog>",
      xml+="\n\t\t<title>"+articles_all[i].title+"</title>";
      let article = await getArticle(articles_all[i].id);
      if(null != article){
        xml+="\n\t\t<content>"+article.contentMD.replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('&','&amp;')+"</content>"
      }
      xml+="\n\t\t<url>https://"+OPT.siteDomain+"/article/"+articles_all[i].id+"/"+articles_all[i].link+".html</url>",
      xml+="\n\t\t<time>"+articles_all[i].createDate.substr(0,10)+"</time>",
      xml+="\n\t</blog>";
    }
    xml+="\n</blogs>"
  }
  return new Response(xml,{
    headers:{
      "content-type":"text/xml;charset=UTF-8"
    },
    status:200
  });
}

//渲染前端博客：指定一级路径page\tags\category，二级路径value，以及页码，默认第一页
async function renderBlog(url){
  console.log("---进入renderBlog函数---，path=", url.href.substr(url.origin.length))
  
  //处理主题预览及分页
  let theme=url.searchParams.get("theme"),
      pageSize=url.searchParams.get("pageSize");
  if(theme){
    OPT.themeURL=OPT.theme_github_path+theme+"/";
  }
  if(pageSize){
    OPT.pageSize=parseInt(pageSize);
  }
  //如果采用默认default主题，则改为加载default2.0主题
  if(OPT.theme_github_path+"default/"==OPT.themeURL){
    OPT.themeURL=OPT.theme_github_path+"default2.0/";
  }
  console.log("theme pageSize",OPT.pageSize,OPT.themeURL)
  
  //获取主页模板源码
  let theme_html=await getThemeHtml("index"),
      //KV中读取导航栏、分类目录、标签、链接、所有文章、近期文章等配置信息
      menus=await getWidgetMenu(),
      categories=await getWidgetCategory(),
      tags=await getWidgetTags(),
      links=await getWidgetLink(),
      articles_all=await getArticlesList(),
      articles_recently=await getRecentlyArticles(articles_all);
  
  /** 前台博客
   *  路径格式：
   *  域名/              文章列表首页，等价于域名/page/1
   *  域名/page/xxx      文章列表翻页
   * 
   *  域名/category/xxx  分类页，等价于域名/category/xxx/page/1
   *  域名/category/xxx/page/xxx  分类页+翻页
   * 
   *  域名/tags/xxx      标签页，等价于域名/tags/xxx/page/1
   *  域名/tags/xxx/page/xxx  分类页+翻页
   * 
   */
  let paths = url.pathname.trim("/").split("/")
  let articles=[],
      pageNo=1
  //获取文章列表
  switch(paths[0]||"page"){
  case "page":
    articles = articles_all
    pageNo = paths[1]||1
    break;
  case "tags":
  case "category":
    let category_tag = paths.slice(1).join("");//如果无分页，tags、category后面都是标签、分类名
    if(paths.length>3 && paths.includes("page")){
      pageNo = paths[paths.indexOf("page")+1] //分页的页码
      category_tag = paths.slice(1, paths.lastIndexOf("page")-1).join("") //tags、category后，分页前的为标签、分类名
    }
    category_tag = decodeURIComponent(category_tag)
    articles = articles_all.filter(a => a[paths[0]].includes(category_tag))
    break;
  }
  pageNo = parseInt(pageNo)
  // console.log(pageNo)
  // console.log(articles)

  //获取当页要显示文章列表
  let articles_show = articles.slice((pageNo-1)*OPT.pageSize,pageNo*OPT.pageSize);
  // console.log(articles_show)
  
  //处理文章属性（年月日、url等）
  processArticleProp(articles_show);

  // console.log(url.pathname)
  let url_prefix = url.pathname.replace(/(.*)\/page\/\d+/,'$1/')
  if(url_prefix.substr(-1)=='/'){
    url_prefix=url_prefix.substr(0,url_prefix.length-1);
  }
  // console.log(url_prefix)
  //组装各种参数
  let newer=[{title:"上一页",url:url_prefix+"/page/"+(pageNo-1)}];
  if(1==pageNo){
    newer=[];
  }
  let older=[{title:"下一页",url:url_prefix+"/page/"+(pageNo+1)}];
  if(pageNo*OPT.pageSize>=articles.length){
    older=[];
  }
  // console.log(newer)
  // console.log(older)

  //文章标题、关键字
  let title=(pageNo>1 ? "page "+pageNo+" - " : "")+OPT.siteName,
      keyWord=OPT.keyWords,
      cfg={};
  cfg.widgetMenuList=menus,//导航
  cfg.widgetCategoryList=categories,//分类目录
  cfg.widgetTagsList=tags,//标签
  cfg.widgetLinkList=links,//链接
  cfg.widgetRecentlyList=articles_recently,//近期文章
  cfg.articleList=articles_show,//当前页文章列表
  cfg.pageNewer=newer,//上翻页链接
  cfg.pageOlder=older,//下翻页链接
  cfg.title=title,//网页title
  cfg.keyWords=keyWord;//SEO关键字
  
  //使用mustache.js进行页面渲染（参数替换）
  cfg.OPT=OPT
  
  let html = Mustache.render(theme_html,cfg)
  
  return new Response(html,{
    headers:{
      "content-type":"text/html;charset=UTF-8"
    },
    status:200
  })
}

//渲染前端博客的文章内容页
async function handle_article(id){
  //获取内容页模板源码
  let theme_html=await getThemeHtml("article"),
      //KV中读取导航栏、分类目录、标签、链接、近期文章等配置信息
      menus=await getWidgetMenu(),
      categories=await getWidgetCategory(),
      tags=await getWidgetTags(),
      links=await getWidgetLink(),
      articles_recently=await getRecentlyArticles();

  //获取上篇、本篇、下篇文章
  let articles_sibling=await getSiblingArticle(id);
  
  //处理文章属性（年月日、url等）
  processArticleProp(articles_sibling);
  
  //获取本篇文章
  let article=articles_sibling[1];

  //组装文章详情页各参数
  let title=article.title.replace(nullToEmpty(OPT.top_flag),'').replace(nullToEmpty(OPT.hidden_flag),'')+" - "+OPT.siteName, 
      keyWord=article.tags.concat(article.category).join(","),
      cfg={};
  cfg.widgetMenuList=menus,//导航
  cfg.widgetCategoryList=categories,//分类目录
  cfg.widgetTagsList=tags,//标签
  cfg.widgetLinkList=links,//链接
  cfg.widgetRecentlyList=articles_recently,//近期文章
  cfg.articleOlder=articles_sibling[0]?[articles_sibling[0]]:[],//上篇文章
  cfg.articleSingle=article,//本篇文章
  cfg.articleNewer=articles_sibling[2]?[articles_sibling[2]]:[],//下篇文章
  cfg.title=title,//网页title
  cfg.keyWords=keyWord;//SEO关键字
  
  //使用mustache.js渲染页面（参数替换）
  cfg.OPT=OPT
  
  let html = Mustache.render(theme_html,cfg)

  //以html格式返回
  return new Response(html,{
    headers:{
      "content-type":"text/html;charset=UTF-8"
    },
    status:200
  })
}

//后台请求处理
async function handle_admin(request){
  let url = new URL(request.url),
      paths = url.pathname.trim("/").split("/"),
      html,//返回html
      json,//返回json
      file;//返回文件
  //新建页
  if(1==paths.length||"list"==paths[1]){
    //读取主题的admin/index.html源码
    let theme_html=await getThemeHtml("admin/index"),
        //KV中读取导航栏、分类目录、链接、近期文章等配置信息
        categoryJson=await getWidgetCategory(),
        menuJson=await getWidgetMenu(),
        linkJson=await getWidgetLink();
    
    //手动替换<!--{xxx}-->格式的参数
    html = theme_html.replaceHtmlPara("categoryJson",JSON.stringify(categoryJson))
                    .replaceHtmlPara("menuJson",JSON.stringify(menuJson))
                    .replaceHtmlPara("linkJson",JSON.stringify(linkJson))
                    
    //添加后台首页配置
    if(OPT.admin_home_idx && OPT.admin_home_idx>=1 && OPT.admin_home_idx<=4){
      html = html.replace("$('#myTab li:eq(0) 1').tab('show')","$($('#myTab a[href*=\"'+location.hash+'\"]')[0]||$('#myTab a:eq("+OPT.admin_home_idx+")')).tab('show')")
    }
    //添加置顶样式
    if(OPT.top_flag_style){
      html += OPT.top_flag_style
    }
    //添加隐藏样式
    if(OPT.hidden_flag_style){
      html += OPT.hidden_flag_style
    }
  }

  //发布
  if("publish"==paths[1]){
    //KV中获取文章列表
    let articles_all=await getAllArticlesList(),
        tags=[]; //操作标签
    
    //遍历所有文章，汇集所有的tag
    for(var i=0;i<articles_all.length;i++){
      //若文章设定了标签
      if("object"==typeof articles_all[i].tags){
        //将所有tags存入e中
        for(var j=0;j<articles_all[i].tags.length;j++){
          if(articles_all[i].tags[j] 
            && articles_all[i].tags[j].length>0 
            && -1==tags.indexOf(articles_all[i].tags[j])){
            tags.push(articles_all[i].tags[j]);
          }
        }
      }
    }
    console.log(articles_all)
    //将所有标签一次性写入到KV中，并清除缓存
    await saveWidgetTags(JSON.stringify(tags))
    
    json = await purge()?'{"msg":"published ,purge Cache true","rst":true}':'{"msg":"published ,buuuuuuuuuuuut purge Cache false !!!!!!","rst":true}'
      
  }

  //文章列表
  if("getList"==paths[1]){
    //默认取第一页，每页20篇
    let pageNo=(undefined===paths[2]) ? 1 : parseInt(paths[2]),
        list=await admin_nextPage(pageNo, 20);//每次加载20个
    json = JSON.stringify(list)
  }
  
  //修改文章
  if("edit"==paths[1]){
    let id=paths[2],
        //获取主题admin/edit源码
        theme_html=await getThemeHtml("admin/edit"),
        //KV中读取分类
        categoryJson=JSON.stringify(await getWidgetCategory()),
        //KV中读取文章内容
        articleJson=JSON.stringify(await getArticle(id));
    
    //手动替换<!--{xxx}-->格式的参数
    html = theme_html.replaceHtmlPara("categoryJson",categoryJson).replaceHtmlPara("articleJson",articleJson.replaceAll("script>","script＞"))
  }
  
  //保存配置
  if("saveConfig"==paths[1]){
    const ret=await parseReq(request);
    let widgetCategory=ret.WidgetCategory,//分类
        widgetMenu=ret.WidgetMenu,//导航
        widgetLink=ret.WidgetLink;//链接
    
    //判断格式，写入分类、导航、链接到KV中
    if(checkFormat(widgetCategory) && checkFormat(widgetMenu) && checkFormat(widgetLink)){
      let success = await saveWidgetCategory(widgetCategory)
      success = success && await saveWidgetMenu(widgetMenu)
      success = success && await saveWidgetLink(widgetLink)
      json = success ? '{"msg":"saved","rst":true}' : '{"msg":"Save Faild!!!","ret":false}'
    }else{
      json = '{"msg":"Not a JSON object","rst":false}'
    }
  }
  
  //导入
  if("import"==paths[1]){
    let importJsone=(await parseReq(request)).importJson;
    console.log("开始导入",typeof importJson)
    
    if(checkFormat(importJson)){
      let importJson=JSON.parse(importJson),
          keys=Object.keys(importJson);
      for(let i=0;i<keys.length;++i){
        console.log(keys[i],importJson[keys[i]]),
        await saveArticle(keys[i],importJson[keys[i]]);
      }
      json = '{"msg":"import success!","rst":true}'
    }else{
      json = '{"msg":" importJson Not a JSON object","rst":false}'
    }        
  }
  
  //导出
  if("export"===paths[1]){
    console.log("开始导出");
    async function exportArticle(arr=[],cursor="",limit=1){
      //分页获取文章内容
      const list=await CFBLOG.list({limit:limit,cursor:cursor});
      if(!1 in list) return {};
      arr=arr.concat(list.keys)
      console.log("导出: ",typeof list, JSON.stringify(list))
      //判断是否导出完毕
      if(list.list_complete){
        let ret = {OPT:OPT};
        for(let i=0;i<arr.length;++i){
          const article = await CFBLOG.get(arr[i].name);
          if(null != article){
            ret[arr[i].name] = checkFormat(article)?JSON.parse(article):article
          }
        }
        return ret
      }
      return await exportArticle(arr,list.cursor,limit)
    }
    
    let articles=await exportArticle();
    file = {
      name: "cfblog-"+new Date().getTime()+".json",
      content: JSON.stringify(articles)
    }
  }
  
  //导出search.xml 
  if("search.xml"===paths[1]){
    console.log("开始导出");
    //读取文章列表，并按照特定的xml格式进行组装
    let articles_all=await getArticlesList()
    let xml='<?xml version="1.0" encoding="UTF-8"?>\n<blogs>';
    for(var i=0;i<articles_all.length;i++){
      xml+="\n\t<blog>",
      xml+="\n\t\t<title>"+articles_all[i].title+"</title>";
      let article = await getArticle(articles_all[i].id);
      if(null != article){
        xml+="\n\t\t<content>"+article.contentMD.replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('&','&amp;')+"</content>"
      }
      xml+="\n\t\t<url>https://"+OPT.siteDomain+"/article/"+articles_all[i].id+"/"+articles_all[i].link+".html</url>",
      xml+="\n\t\t<time>"+articles_all[i].createDate.substr(0,10)+"</time>",
      xml+="\n\t</blog>";
    }
    xml+="\n</blogs>"
    file = {
      name: "search.xml",
      content: xml
    }
  }
  
  //导出sitemap.xml 
  if("sitemap.xml"===paths[1]){
    console.log("开始导出");
    //读取文章列表，并按照特定的xml格式进行组装
    let articles_all=await getArticlesList()
    let xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    for(var i=0;i<articles_all.length;i++){
      xml+="\n\t<url>",
      xml+="\n\t\t<loc>https://"+OPT.siteDomain+"/article/"+articles_all[i].id+"/"+articles_all[i].link+".html</loc>",
      xml+="\n\t\t<lastmod>"+articles_all[i].createDate.substr(0,10)+"</lastmod>",
      xml+="\n\t\t<changefreq>"+(void 0===articles_all[i].changefreq?"daily":articles_all[i].changefreq)+"</changefreq>",
      xml+="\n\t\t<priority>"+(void 0===articles_all[i].priority?"0.5":articles_all[i].priority)+"</priority>",
      xml+="\n\t</url>";
    }
    xml+="\n</urlset>"
    file = {
      name: "sitemap.xml",
      content: xml
    }
  }
  
  //新建文章
  if("saveAddNew"==paths[1]){
    const ret=await parseReq(request);
    let title=ret.title,//文章标题
        img=ret.img,//插图
        link=ret.link,//永久链接
        createDate=ret.createDate.replace('T',' '),//发布日期
        category=ret.category,//分类
        tags=ret.tags,//标签
        priority=void 0===ret.priority?"0.5":ret.priority,//权重
        changefreq=void 0===ret.changefreq?"daily":ret.changefreq,//更新频率
        contentMD=ret["content-markdown-doc"],//文章内容-md格式
        contentHtml=ret["content-html-code"],//文章内容-html格式
        contentText="",//文章摘要
        top_timestamp=ret.top_timestamp*1,//置顶时间戳，不置顶时为0
        modify_timestamp=new Date().getTime()+8*60*60*1000,//修改时间戳
        hidden=ret.hidden*1,//是否隐藏
        id="";//文章id
    
    //校验参数完整性
    if(title.length>0
      && createDate.length>0
      && category.length>0
      && contentMD.length>0
      && contentHtml.length>0){

      id=await generateId(),
      contentText=contentHtml.replace(/<\/?[^>]*>/g,"").trim().substring(0,OPT.readMoreLength);//摘要
      //组装文章json
      let article={
        id:id,
        title:title,
        img:img,
        link:link,
        createDate:createDate,
        category:category,
        tags:tags,
        contentMD:contentMD,
        contentHtml:contentHtml,
        contentText:contentText,
        priority:priority,
        top_timestamp:top_timestamp,
        modify_timestamp:modify_timestamp,
        hidden:hidden,
        changefreq:changefreq
      };
      
      //将文章json写入KV（key为文章id，value为文章json字符串）
      await saveArticle(id,JSON.stringify(article));
      
      //组装文章json
      let articleWithoutHtml={
        id:id,
        title:title,
        img:img,
        link:link,
        createDate:createDate,
        category:category,
        tags:tags,
        contentText:contentText,
        priority:priority,
        top_timestamp:top_timestamp,
        modify_timestamp:modify_timestamp,
        hidden:hidden,
        changefreq:changefreq
      },
      articles_all_old=await getAllArticlesList(),//读取文章列表
      articles_all=[];
    
      //将最新的文章写入文章列表中，并按id排序后，再次回写到KV中
      articles_all.push(articleWithoutHtml),
      articles_all=articles_all.concat(articles_all_old),
      articles_all=sortArticle(articles_all),
      await saveArticlesList(JSON.stringify(articles_all))
      
      json = '{"msg":"added OK","rst":true,"id":"'+id+'"}'
    }else{
      json = '{"msg":"信息不全","rst":false}'
    }
  }
  
  //删除
  if("delete"==paths[1]){
    let id=paths[2]
    if(6==id.length){
      try {
        // 1. 首先删除文章内容
        await CFBLOG.delete(id);
        console.log(`文章内容删除成功: ${id}`);
        
        // 2. 获取并更新文章列表
        let articles = await getAllArticlesList();
        let originalLength = articles.length;
        articles = articles.filter(article => article.id !== id);
        
        if(articles.length < originalLength){
          // 3. 保存更新后的文章列表
          let saveResult = await saveArticlesList(JSON.stringify(articles));
          console.log(`文章列表更新结果: ${saveResult}`);
          
          // 4. 更新文章序号
          let indexNum = articles.length > 0 ? 
            Math.max(...articles.map(a => parseInt(a.id))) : 0;
          await saveIndexNum(indexNum);
          console.log(`文章序号已更新为: ${indexNum}`);
          
          // 5. 强制清除缓存
          let purgeResult = await purge();
          console.log(`缓存清除结果: ${purgeResult}`);
          
          // 6. 返回成功响应
          json = JSON.stringify({
            status: "success",
            message: "文章删除成功",
            id: id,
            purged: purgeResult,
            newIndexNum: indexNum
          });
        } else {
          json = JSON.stringify({
            status: "error",
            message: "文章在列表中未找到",
            id: id
          });
        }
      } catch(e) {
        console.error("删除文章时出错:", e);
        json = JSON.stringify({
          status: "error",
          message: "删除文章时发生错误: " + e.message,
          id: id
        });
      }
    } else {
      json = JSON.stringify({
        status: "error",
        message: "无效的文章ID",
        id: id
      });
    }
  }
  
  //保存编辑的文章
  if("saveEdit"==paths[1]){
    const ret=await parseReq(request);
    let title=ret.title,//文章标题
        img=ret.img,//插图
        link=ret.link,//永久链接
        createDate=ret.createDate.replace('T',' '),//发布日期
        category=ret.category,//分类
        tags=ret.tags,//标签
        priority=void 0===ret.priority?"0.5":ret.priority,//权重
        changefreq=void 0===ret.changefreq?"daily":ret.changefreq,//更新频率
        contentMD=ret["content-markdown-doc"],//文章内容-md格式
        contentHtml=ret["content-html-code"],//文章内容-html格式
        contentText="",//文章摘要
        top_timestamp=ret.top_timestamp*1,//置顶则设置时间戳,不置顶时为0
        modify_timestamp=new Date().getTime()+8*60*60*1000,//修改时间戳
        hidden=ret.hidden*1,//是否隐藏
        id=ret.id;//文章id
        
    //校验参数完整性
    if(title.length>0
      && createDate.length>0
      && category.length>0
      && contentMD.length>0
      && contentHtml.length>0){
          
      contentText=contentHtml.replace(/<\/?[^>]*>/g,"").trim().substring(0,OPT.readMoreLength);//摘要
      //组装文章json
      let article={
        id:id,
        title:title,
        img:img,
        link:link,
        createDate:createDate,
        category:category,
        tags:tags,
        contentMD:contentMD,
        contentHtml:contentHtml,
        contentText:contentText,
        priority:priority,
        top_timestamp:top_timestamp,
        modify_timestamp:modify_timestamp,
        hidden:hidden,
        changefreq:changefreq
      };
      
      //将文章json写入KV（key为文章id，value为文章json字符串）
      await saveArticle(id,JSON.stringify(article));
      
      //组装文章json
      let articleWithoutHtml={
        id:id,
        title:title,
        img:img,
        link:link,
        createDate:createDate,
        category:category,
        tags:tags,
        contentText:contentText,
        priority:priority,
        top_timestamp:top_timestamp,
        modify_timestamp:modify_timestamp,
        hidden:hidden,
        changefreq:changefreq
      },
      articles_all=await getAllArticlesList();//读取文章列表
      //console.log(articles_all)
      //将原对象删掉，将最新的文章加入文章列表中，并重新按id排序后，再次回写到KV中
      for(var i=articles_all.length-1;i>=0;i--){//按索引删除，要倒序，否则索引值会变
        if(articles_all[i].id == id){
          articles_all.splice(i,1);
          break;
        }
      }
      articles_all.push(articleWithoutHtml),
      articles_all=sortArticle(articles_all),
      await saveArticlesList(JSON.stringify(articles_all))
      json = '{"msg":"Edit OK","rst":true,"id":"'+id+'"}'
    }else{
      json = '{"msg":"信息不全","rst":false}'
    }
  }
  
  //返回结果
  if(!json &&!html && !file){
    json = '{"msg":"some errors","rst":false}'
  }
  if(file){
    return new Response(file.content,{
      headers:{
        "content-type":"application/octet-stream;charset=utf-8",
        "Content-Disposition":"attachment; filename="+file.name
      },
      status:200
    })
  }
  if(html){
    return new Response(html,{
      headers:{
        "content-type":"text/html;charset=UTF-8"
      },
      status:200
    })
  }
  if(json){
    return new Response(json ,{
      headers:{
        "content-type":"application/json;charset=UTF-8"
      },
      status:200
    })
  }
}

/**------【④.抽丝剥茧，抽取公用的业务方法】-----**/

//访问管理后台或私密博客，则进行Base Auth
function parseBasicAuth(request){
    const auth = request.headers.get("Authorization");
    if(!auth || !/^Basic [A-Za-z0-9._~+/-]+=*$/i.test(auth)){
        const token = request.headers.get("cfblog_token");
        if(token){
            //获取url请求对象
            let url = new URL(request.url)
            let paths = url.pathname.trim("/").split("/")

            //校验权限
            if("admin"==paths[0] && ("search.xml"==paths[1]||"sitemap.xml"==paths[1])){
                return token === ACCOUNT.third_token
            }
        }
        return false;
    }
    const[user, pwd] = atob(auth.split(" ").pop()).split(":");
    console.log("-----parseBasicAuth----- ", user, pwd)
    return user === ACCOUNT.user && pwd === ACCOUNT.password
}

// 添加登录页面处理函数
async function handle_login(request) {
    const url = new URL(request.url);
    
    // 处理登录表单提交
    if (request.method === "POST") {
        const formData = await request.formData();
        const username = formData.get("username");
        const password = formData.get("password");
        
        if (username === ACCOUNT.user && password === ACCOUNT.password) {
            // 登录成功，生成一个简单的token（实际应用中应使用更安全的方法）
            const token = btoa(username + ":" + password);
            
            // 重定向到管理页面，带上Authorization头
            return new Response("Login successful", {
                status: 302,
                headers: {
                    "Set-Cookie": `auth=${token}; HttpOnly; Path=/admin; SameSite=Strict`,
                    "Location": "/admin"
                }
            });
        } else {
            // 登录失败，返回登录页面并显示错误
            return renderLoginPage(true);
        }
    }
    
    // 显示登录页面
    return renderLoginPage(false);
}

// 渲染登录页面函数
function renderLoginPage(showError) {
    const errorMessage = showError ? '<div class="error-message">用户名或密码错误</div>' : '';
    
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理员登录 - ${OPT.siteName}</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
            padding: 40px;
            width: 400px;
            max-width: 90%;
        }
        .login-header {
            text-align: center;
            margin-bottom: 40px;
        }
        .login-header h1 {
            color: #333;
            font-size: 28px;
            font-weight: 600;
        }
        .login-header img {
            width: 80px;
            height: 80px;
            margin-bottom: 20px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            color: #555;
            font-weight: 500;
        }
        .form-group input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            transition: all 0.3s;
        }
        .form-group input:focus {
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0,123,255,0.2);
            outline: none;
        }
        .submit-btn {
            width: 100%;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 12px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s;
        }
        .submit-btn:hover {
            background-color: #0069d9;
        }
        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
        }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 20px;
            color: #6c757d;
            text-decoration: none;
            font-size: 14px;
        }
        .back-link:hover {
            color: #007bff;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <img src="${OPT.logo}" alt="${OPT.siteName} Logo">
            <h1>${OPT.siteName} 管理后台</h1>
        </div>
        ${errorMessage}
        <form method="POST" action="/login">
            <div class="form-group">
                <label for="username">用户名</label>
                <input type="text" id="username" name="username" required autofocus>
            </div>
            <div class="form-group">
                <label for="password">密码</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="submit-btn">登录</button>
        </form>
        <a href="/" class="back-link">返回博客首页</a>
    </div>
</body>
</html>`;

    return new Response(html, {
        headers: {
            "content-type": "text/html;charset=UTF-8"
        }
    });
}

//获取所有【公开】文章：仅前台使用
async function getArticlesList(){
  let articles_all = await getAllArticlesList();
  
  for(var i=0;i<articles_all.length;i++)
    if(articles_all[i].hidden){
        articles_all.splice(i,1);
    }
  return articles_all;
}

//文章排序：先按id倒排，再按置顶时间倒排
function sortArticle(articles){
  return sort(sort(articles,'id'),'top_timestamp');
}

//获取近期文章列表
async function getRecentlyArticles(articles){
  if(!articles){
    articles = await getArticlesList();
  }
  if(OPT.recentlyType == 2){//按修改时间倒序
    articles = sort([].concat(articles),'modify_timestamp');
  }
  let articles_recently = articles.slice(0,OPT.recentlySize);

  for(var i=0;i<articles_recently.length;i++){
      //调整文章的日期(yyyy-MM-dd)和url
      if(articles_recently[i].top_timestamp && !articles_recently[i].title.startsWith(OPT.top_flag)){
        articles_recently[i].title = OPT.top_flag + articles_recently[i].title
      }
      articles_recently[i].createDate10=articles_recently[i].createDate.substr(0,10),
      articles_recently[i].url="/article/"+articles_recently[i].id+"/"+articles_recently[i].link+".html";
  }
  return articles_recently;
}

//处理文章的属性信息：日期(yyyy-MM-dd)、年、月、日、内容长度和url
function processArticleProp(articles){
    for(var i=0;i<articles.length;i++){
        //调整文章的日期(yyyy-MM-dd)、文章长度和url
        if(articles[i]){
            if(articles[i].top_timestamp && !articles[i].title.startsWith(OPT.top_flag)){
              articles[i].title = OPT.top_flag + articles[i].title
            }
            //调整文章的日期(yyyy-MM-dd)、年、月、日、内容长度和url
            articles[i].createDate10=articles[i].createDate.substr(0,10),
            articles[i].createDateYear=articles[i].createDate.substr(0,4),
            articles[i].createDateMonth=articles[i].createDate.substr(5,7),
            articles[i].createDateDay=articles[i].createDate.substr(8,10),
            articles[i].contentLength=articles[i].contentText.length,
            articles[i].url="/article/"+articles[i].id+"/"+articles[i].link+".html";
        }
    }
}

//获取前台模板源码, template_path:模板的相对路径
async function getThemeHtml(template_path){
  template_path=template_path.replace(".html","")
  let html = await (await fetch(OPT.themeURL+template_path+".html",{cf:{cacheTtl:600}})).text();
  
  //对后台编辑页下手
  if("admin/index|admin/editor".includes(template_path)){
      html = html.replace("$('#WidgetCategory').val(JSON.stringify(categoryJson))",OPT.editor_page_scripts+"$('#WidgetCategory').val(JSON.stringify(categoryJson))")
  }
  
  return html
}

//根据文章id，返回上篇、下篇文章，文章内容页底部会用到
async function getSiblingArticle(id){
    id=("00000"+parseInt(id)).substr(-6);
    //读取文章列表，查找指定id的文章
    let articles_all=await getArticlesList(),
        article_idx=-1;
    for(var i=0,len=articles_all.length;i<len;i++)
      if(articles_all[i].id==id){
          article_idx=i;
          break
      }
    let value=await getArticle(id);
    return null==value||0===value.length?[void 0,void 0,void 0]:[articles_all[article_idx-1],value,articles_all[article_idx+1]]
}

//清除缓存
async function purge(cacheZoneId=ACCOUNT.cacheZoneId, cacheToken=ACCOUNT.cacheToken){
    if(null==cacheZoneId || null==cacheToken || cacheZoneId.length<5 || cacheToken.length<5){
        console.warn("缓存清除失败：缺少有效的cacheZoneId或cacheToken");
        return false;
    }
    
    try {
        // 尝试清除所有缓存
        let ret = await fetch(`https://api.cloudflare.com/client/v4/zones/${cacheZoneId}/purge_cache`,{
            method: "POST",
            headers: {
                "Authorization": "Bearer " + cacheToken,
                "Content-Type": "application/json"
            },
            body: '{"purge_everything":true}'
        });
        
        const result = await ret.json();
        console.log("缓存清除结果:", result);
        
        if(!result.success) {
            console.error("缓存清除失败:", result.errors);
            return false;
        }
        
        return true;
    } catch(e) {
        console.error("缓存清除出错:", e);
        return false;
    }
}

//后台文章列表页的分页加载，返回[文章列表,是否无下一页]
async function admin_nextPage(pageNo,pageSize=OPT.pageSize){
    pageNo=pageNo<=1?1:pageNo;
    let articles_all=await getAllArticlesList(),
        articles=[];
    for(var i=(pageNo-1)*pageSize,s=Math.min(pageNo*pageSize,articles_all.length);i<s;i++){
      if(articles_all[i].top_timestamp && !articles_all[i].title.startsWith(OPT.top_flag)){
        articles_all[i].title = OPT.top_flag + articles_all[i].title
      }
      if(articles_all[i].hidden && !articles_all[i].title.startsWith(OPT.hidden_flag)){
        articles_all[i].title = OPT.hidden_flag + articles_all[i].title
      }
      articles.push(articles_all[i]);
    }
    return articles
}

//解析后台请求的参数
async function parseReq(request){
    const content_type=request.headers.get("content-type")||"";
    //json格式
    if(content_type.includes("application/json")){
    let json=JSON.stringify(await request.json()),
        content_type=JSON.parse(json),
        settings={category:[],top_timestamp:0, hidden:0};
        for(var i=0;i<content_type.length;i++){
            if("tags"==content_type[i].name){//标签，用逗号分隔
                settings[content_type[i].name]=content_type[i].value.split(",")
            }else if(content_type[i].name.includes("category")){
                settings.category.push(content_type[i].value)
            }else{
                settings[content_type[i].name]=content_type[i].value
            }
        }
        return settings
    }
    if(content_type.includes("application/text")){
        return await request.text();
    }
    if(content_type.includes("text/html")){
        return await request.text();
    }
    if(content_type.includes("form")){
        const formData=await request.formData(),
                ret={};
        for(const field of formData.entries())
            ret[field[0]]=field[1];
        return JSON.stringify(ret)
    }
    {
        const blob=await request.blob();
        return URL.createObjectURL(blob)
    }
}

//为文章分配ID
async function generateId(){
    //KV中读取文章数量（初始化为1），并格式化为6位，不足6位前面补零
    let article_id_seq=await getIndexNum();
    if(""===article_id_seq||null===article_id_seq||"[]"===article_id_seq||void 0===article_id_seq){
        await saveIndexNum(1)
        return "000001"
    }else{
        await saveIndexNum(parseInt(article_id_seq)+1)
        return ("00000"+(parseInt(article_id_seq)+1)).substr(-6)
    }
}

/**------【⑤.术业有专攻，读写KV方法集】-----**/

/* 【KV的Key的含义】
  SYSTEM_INDEX_LIST             文章列表(不包含内容)
  SYSTEM_INDEX_NUM              最新文章序号（不删除文章时，等于文章数量）
  SYSTEM_VALUE_WidgetMenu       导航栏
  SYSTEM_VALUE_WidgetCategory   分类目录
  SYSTEM_VALUE_WidgetTags       标签
  SYSTEM_VALUE_WidgetLink       链接
*/

//KV读取，toJson是否转为json，默认false
async function getKV(key, toJson=false){
  console.log("------------KV读取------------key,toJson:", key, toJson);
  let value=await CFBLOG.get(key);
  if(!toJson)
    return null==value?"[]":value;
  try{
    return null==value?[]:JSON.parse(value)
  }catch(e){
    return[]
  }
}
//KV读取，获取所有文章（含公开+隐藏）:仅后台使用
async function getAllArticlesList(){
  return await getKV("SYSTEM_INDEX_LIST", true);
}
//KV读取，最新文章序号（不删除文章时，等于文章数量），用于计算下个文章id
async function getIndexNum(){
  return await getKV("SYSTEM_INDEX_NUM", true);
}
//KV读取，获取导航栏
async function getWidgetMenu(){
  return await getKV("SYSTEM_VALUE_WidgetMenu", true);
}
//KV读取，获取分类目录
async function getWidgetCategory(){
  return await getKV("SYSTEM_VALUE_WidgetCategory", true);
}
//KV读取，获取标签
async function getWidgetTags(){
  return await getKV("SYSTEM_VALUE_WidgetTags", true);
}
//KV读取，获取链接
async function getWidgetLink(){
  return await getKV("SYSTEM_VALUE_WidgetLink", true);
}
//KV读取，获取文章详细信息
async function getArticle(id){
  return await getKV(id, true);
}

//写入KV，value如果未对象类型（数组或者json对象）需要序列化为字符串
async function saveKV(key,value){
    if(null!=value){
        if("object"==typeof value){
            value=JSON.stringify(value)
        }
        await CFBLOG.put(key,value)
        return true
    }
    return false;
}

//写入KV，获取所有文章（含公开+隐藏）:仅后台使用
async function saveArticlesList(value){
  return await saveKV("SYSTEM_INDEX_LIST",value);
}
//写入KV，最新文章序号（不删除文章时，等于文章数量），用于计算下个文章id
async function saveIndexNum(value){
  return await saveKV("SYSTEM_INDEX_NUM", value);
}
//写入KV，获取导航栏
async function saveWidgetMenu(value){
  return await saveKV("SYSTEM_VALUE_WidgetMenu", value);
}
//写入KV，获取分类目录
async function saveWidgetCategory(value){
  return await saveKV("SYSTEM_VALUE_WidgetCategory", value);
}
//写入KV，获取标签
async function saveWidgetTags(value){
  return await saveKV("SYSTEM_VALUE_WidgetTags", value);
}
//写入KV，获取链接
async function saveWidgetLink(value){
  return await saveKV("SYSTEM_VALUE_WidgetLink", value);
}
//写入KV，获取文章详细信息
async function saveArticle(id,value){
  return await saveKV(id, value);
}

/**------【⑥.站在巨人肩膀上，基础方法】-----**/

//扩展String的方法：
//trim清除前后空格
String.prototype.trim=function(t){
  return t?this.replace(new RegExp("^\\"+t+"+|\\"+t+"+$","g"),""):this.replace(/^\s+|\s+$/g,"")
}
//replaceHtmlPara替换<!--{参数}-->
String.prototype.replaceHtmlPara=function(t,e){
  return null!=e&&(e=e.replace(new RegExp("[$]","g"),"$$$$")),this.replace(new RegExp("\x3c!--{"+t+"}--\x3e","g"),e)
}
//replaceAll 替换全部
String.prototype.replaceAll=function(t,e){
  return this.replace(new RegExp(t,"g"),e)
}

//小于2位，前面补个0
function pad(t){
    return t>=0&&t<=9?"0"+t:t
}

//排序（默认倒序）
function sort(arr, field, desc=true){
    return arr.sort((function(m,n){
        var a=m[field]||'0',
            b=n[field]||'0';
        return desc?(a>b?-1:(a<b?1:0)):(a<b?-1:(a>b?1:0))
    }))
}

//undefined转空字符串
function nullToEmpty(k){
  return k==undefined?'':k
}

//判断格式:字符串是否为json，或者参数是否为对象
function checkFormat(t){
    if("string"==typeof t){
        try{
            var e=JSON.parse(t);
            return !("object"!=typeof e||!e)
        }catch(t){
            return false
        }
    }
    return !("object"!=typeof t||!t)
}

//引入mustache.js，4.1.0：https://cdn.bootcdn.net/ajax/libs/mustache.js/4.1.0/mustache.min.js
(function(global,factory){typeof exports==="object"&&typeof module!=="undefined"?module.exports=factory():typeof define==="function"&&define.amd?define(factory):(global=global||self,global.Mustache=factory())})(this,function(){"use strict";var objectToString=Object.prototype.toString;var isArray=Array.isArray||function isArrayPolyfill(object){return objectToString.call(object)==="[object Array]"};function isFunction(object){return typeof object==="function"}function typeStr(obj){return isArray(obj)?"array":typeof obj}function escapeRegExp(string){return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}function hasProperty(obj,propName){return obj!=null&&typeof obj==="object"&&propName in obj}function primitiveHasOwnProperty(primitive,propName){return primitive!=null&&typeof primitive!=="object"&&primitive.hasOwnProperty&&primitive.hasOwnProperty(propName)}var regExpTest=RegExp.prototype.test;function testRegExp(re,string){return regExpTest.call(re,string)}var nonSpaceRe=/\S/;function isWhitespace(string){return!testRegExp(nonSpaceRe,string)}var entityMap={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#x2F;","`":"&#x60;","=":"&#x3D;"};function escapeHtml(string){return String(string).replace(/[&<>"'`=\/]/g,function fromEntityMap(s){return entityMap[s]})}var whiteRe=/\s*/;var spaceRe=/\s+/;var equalsRe=/\s*=/;var curlyRe=/\s*\}/;var tagRe=/#|\^|\/|>|\{|&|=|!/;function parseTemplate(template,tags){if(!template)return[];var lineHasNonSpace=false;var sections=[];var tokens=[];var spaces=[];var hasTag=false;var nonSpace=false;var indentation="";var tagIndex=0;function stripSpace(){if(hasTag&&!nonSpace){while(spaces.length)delete tokens[spaces.pop()]}else{spaces=[]}hasTag=false;nonSpace=false}var openingTagRe,closingTagRe,closingCurlyRe;function compileTags(tagsToCompile){if(typeof tagsToCompile==="string")tagsToCompile=tagsToCompile.split(spaceRe,2);if(!isArray(tagsToCompile)||tagsToCompile.length!==2)throw new Error("Invalid tags: "+tagsToCompile);openingTagRe=new RegExp(escapeRegExp(tagsToCompile[0])+"\\s*");closingTagRe=new RegExp("\\s*"+escapeRegExp(tagsToCompile[1]));closingCurlyRe=new RegExp("\\s*"+escapeRegExp("}"+tagsToCompile[1]))}compileTags(tags||mustache.tags);var scanner=new Scanner(template);var start,type,value,chr,token,openSection;while(!scanner.eos()){start=scanner.pos;value=scanner.scanUntil(openingTagRe);if(value){for(var i=0,valueLength=value.length;i<valueLength;++i){chr=value.charAt(i);if(isWhitespace(chr)){spaces.push(tokens.length);indentation+=chr}else{nonSpace=true;lineHasNonSpace=true;indentation+=" "}tokens.push(["text",chr,start,start+1]);start+=1;if(chr==="\n"){stripSpace();indentation="";tagIndex=0;lineHasNonSpace=false}}}if(!scanner.scan(openingTagRe))break;hasTag=true;type=scanner.scan(tagRe)||"name";scanner.scan(whiteRe);if(type==="="){value=scanner.scanUntil(equalsRe);scanner.scan(equalsRe);scanner.scanUntil(closingTagRe)}else if(type==="{"){value=scanner.scanUntil(closingCurlyRe);scanner.scan(curlyRe);scanner.scanUntil(closingTagRe);type="&"}else{value=scanner.scanUntil(closingTagRe)}if(!scanner.scan(closingTagRe))throw new Error("Unclosed tag at "+scanner.pos);if(type==">"){token=[type,value,start,scanner.pos,indentation,tagIndex,lineHasNonSpace]}else{token=[type,value,start,scanner.pos]}tagIndex++;tokens.push(token);if(type==="#"||type==="^"){sections.push(token)}else if(type==="/"){openSection=sections.pop();if(!openSection)throw new Error('Unopened section "'+value+'" at '+start);if(openSection[1]!==value)throw new Error('Unclosed section "'+openSection[1]+'" at '+start)}else if(type==="name"||type==="{"||type==="&"){nonSpace=true}else if(type==="="){compileTags(value)}}stripSpace();openSection=sections.pop();if(openSection)throw new Error('Unclosed section "'+openSection[1]+'" at '+scanner.pos);return nestTokens(squashTokens(tokens))}function squashTokens(tokens){var squashedTokens=[];var token,lastToken;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];if(token){if(token[0]==="text"&&lastToken&&lastToken[0]==="text"){lastToken[1]+=token[1];lastToken[3]=token[3]}else{squashedTokens.push(token);lastToken=token}}}return squashedTokens}function nestTokens(tokens){var nestedTokens=[];var collector=nestedTokens;var sections=[];var token,section;for(var i=0,numTokens=tokens.length;i<numTokens;++i){token=tokens[i];switch(token[0]){case"#":case"^":collector.push(token);sections.push(token);collector=token[4]=[];break;case"/":section=sections.pop();section[5]=token[2];collector=sections.length>0?sections[sections.length-1][4]:nestedTokens;break;default:collector.push(token)}}return nestedTokens}function Scanner(string){this.string=string;this.tail=string;this.pos=0}Scanner.prototype.eos=function eos(){return this.tail===""};Scanner.prototype.scan=function scan(re){var match=this.tail.match(re);if(!match||match.index!==0)return"";var string=match[0];this.tail=this.tail.substring(string.length);this.pos+=string.length;return string};Scanner.prototype.scanUntil=function scanUntil(re){var index=this.tail.search(re),match;switch(index){case-1:match=this.tail;this.tail="";break;case 0:match="";break;default:match=this.tail.substring(0,index);this.tail=this.tail.substring(index)}this.pos+=match.length;return match};function Context(view,parentContext){this.view=view;this.cache={".":this.view};this.parent=parentContext}Context.prototype.push=function push(view){return new Context(view,this)};Context.prototype.lookup=function lookup(name){var cache=this.cache;var value;if(cache.hasOwnProperty(name)){value=cache[name]}else{var context=this,intermediateValue,names,index,lookupHit=false;while(context){if(name.indexOf(".")>0){intermediateValue=context.view;names=name.split(".");index=0;while(intermediateValue!=null&&index<names.length){if(index===names.length-1)lookupHit=hasProperty(intermediateValue,names[index])||primitiveHasOwnProperty(intermediateValue,names[index]);intermediateValue=intermediateValue[names[index++]]}}else{intermediateValue=context.view[name];lookupHit=hasProperty(context.view,name)}if(lookupHit){value=intermediateValue;break}context=context.parent}cache[name]=value}if(isFunction(value))value=value.call(this.view);return value};function Writer(){this.templateCache={_cache:{},set:function set(key,value){this._cache[key]=value},get:function get(key){return this._cache[key]},clear:function clear(){this._cache={}}}}Writer.prototype.clearCache=function clearCache(){if(typeof this.templateCache!=="undefined"){this.templateCache.clear()}};Writer.prototype.parse=function parse(template,tags){var cache=this.templateCache;var cacheKey=template+":"+(tags||mustache.tags).join(":");var isCacheEnabled=typeof cache!=="undefined";var tokens=isCacheEnabled?cache.get(cacheKey):undefined;if(tokens==undefined){tokens=parseTemplate(template,tags);isCacheEnabled&&cache.set(cacheKey,tokens)}return tokens};Writer.prototype.render=function render(template,view,partials,config){var tags=this.getConfigTags(config);var tokens=this.parse(template,tags);var context=view instanceof Context?view:new Context(view,undefined);return this.renderTokens(tokens,context,partials,template,config)};Writer.prototype.renderTokens=function renderTokens(tokens,context,partials,originalTemplate,config){var buffer="";var token,symbol,value;for(var i=0,numTokens=tokens.length;i<numTokens;++i){value=undefined;token=tokens[i];symbol=token[0];if(symbol==="#")value=this.renderSection(token,context,partials,originalTemplate,config);else if(symbol==="^")value=this.renderInverted(token,context,partials,originalTemplate,config);else if(symbol===">")value=this.renderPartial(token,context,partials,config);else if(symbol==="&")value=this.unescapedValue(token,context);else if(symbol==="name")value=this.escapedValue(token,context,config);else if(symbol==="text")value=this.rawValue(token);if(value!==undefined)buffer+=value}return buffer};Writer.prototype.renderSection=function renderSection(token,context,partials,originalTemplate,config){var self=this;var buffer="";var value=context.lookup(token[1]);function subRender(template){return self.render(template,context,partials,config)}if(!value)return;if(isArray(value)){for(var j=0,valueLength=value.length;j<valueLength;++j){buffer+=this.renderTokens(token[4],context.push(value[j]),partials,originalTemplate,config)}}else if(typeof value==="object"||typeof value==="string"||typeof value==="number"){buffer+=this.renderTokens(token[4],context.push(value),partials,originalTemplate,config)}else if(isFunction(value)){if(typeof originalTemplate!=="string")throw new Error("Cannot use higher-order sections without the original template");value=value.call(context.view,originalTemplate.slice(token[3],token[5]),subRender);if(value!=null)buffer+=value}else{buffer+=this.renderTokens(token[4],context,partials,originalTemplate,config)}return buffer};Writer.prototype.renderInverted=function renderInverted(token,context,partials,originalTemplate,config){var value=context.lookup(token[1]);if(!value||isArray(value)&&value.length===0)return this.renderTokens(token[4],context,partials,originalTemplate,config)};Writer.prototype.indentPartial=function indentPartial(partial,indentation,lineHasNonSpace){var filteredIndentation=indentation.replace(/[^ \t]/g,"");var partialByNl=partial.split("\n");for(var i=0;i<partialByNl.length;i++){if(partialByNl[i].length&&(i>0||!lineHasNonSpace)){partialByNl[i]=filteredIndentation+partialByNl[i]}}return partialByNl.join("\n")};Writer.prototype.renderPartial=function renderPartial(token,context,partials,config){if(!partials)return;var tags=this.getConfigTags(config);var value=isFunction(partials)?partials(token[1]):partials[token[1]];if(value!=null){var lineHasNonSpace=token[6];var tagIndex=token[5];var indentation=token[4];var indentedValue=value;if(tagIndex==0&&indentation){indentedValue=this.indentPartial(value,indentation,lineHasNonSpace)}var tokens=this.parse(indentedValue,tags);return this.renderTokens(tokens,context,partials,indentedValue,config)}};Writer.prototype.unescapedValue=function unescapedValue(token,context){var value=context.lookup(token[1]);if(value!=null)return value};Writer.prototype.escapedValue=function escapedValue(token,context,config){var escape=this.getConfigEscape(config)||mustache.escape;var value=context.lookup(token[1]);if(value!=null)return typeof value==="number"&&escape===mustache.escape?String(value):escape(value)};Writer.prototype.rawValue=function rawValue(token){return token[1]};Writer.prototype.getConfigTags=function getConfigTags(config){if(isArray(config)){return config}else if(config&&typeof config==="object"){return config.tags}else{return undefined}};Writer.prototype.getConfigEscape=function getConfigEscape(config){if(config&&typeof config==="object"&&!isArray(config)){return config.escape}else{return undefined}};var mustache={name:"mustache.js",version:"4.1.0",tags:["{{","}}"],clearCache:undefined,escape:undefined,parse:undefined,render:undefined,Scanner:undefined,Context:undefined,Writer:undefined,set templateCache(cache){defaultWriter.templateCache=cache},get templateCache(){return defaultWriter.templateCache}};var defaultWriter=new Writer;mustache.clearCache=function clearCache(){return defaultWriter.clearCache()};mustache.parse=function parse(template,tags){return defaultWriter.parse(template,tags)};mustache.render=function render(template,view,partials,config){if(typeof template!=="string"){throw new TypeError('Invalid template! Template should be a "string" '+'but "'+typeStr(template)+'" was given as the first '+"argument for mustache#render(template, view, partials)")}return defaultWriter.render(template,view,partials,config)};mustache.escape=escapeHtml;mustache.Scanner=Scanner;mustache.Context=Context;mustache.Writer=Writer;return mustache});

// 添加删除文章的功能
async function deleteArticle(id) {
  try {
    // 获取文章列表
    let articles = await getAllArticlesList();
    
    // 查找要删除的文章索引
    let index = -1;
    for(let i = 0; i < articles.length; i++) {
      if(articles[i].id === id) {
        index = i;
        break;
      }
    }
    
    // 如果找到文章，从列表中删除
    if(index !== -1) {
      // 从列表中删除文章
      articles.splice(index, 1);
      
      // 更新文章列表
      await saveArticlesList(articles);
      
      // 删除文章内容
      await CFBLOG.delete(id);
      
      // 重新计算最新文章序号
      let maxId = articles.reduce((max, article) => Math.max(max, parseInt(article.id)), 0);
      await saveIndexNum(maxId);
      
      return new Response(JSON.stringify({
        status: "success",
        message: "文章已成功删除",
        indexNum: maxId
      }), {
        headers: { "content-type": "application/json" }
      });
    } else {
      return new Response(JSON.stringify({
        status: "error",
        message: "未找到指定文章"
      }), {
        headers: { "content-type": "application/json" },
        status: 404
      });
    }
  } catch(e) {
    return new Response(JSON.stringify({
      status: "error",
      message: "删除文章失败：" + e.message
    }), {
      headers: { "content-type": "application/json" },
      status: 500
    });
  }
}

// 修改后台HTML页面，在文章列表中添加删除按钮
// 找到admin/index.html文件中处理的getHtmlIndex函数，添加删除按钮和交互脚本
function getHtmlIndex(){
  // ... 现有代码 ...
  
  // 在页面末尾添加删除功能的JavaScript代码
  html = html.replace("</body>", `
  <script>
  // 添加删除文章功能
  function renderArticleList() {
    const articleList = document.getElementById('articleList');
    if (!articleList) return;
    
    // 为每篇文章添加删除按钮
    const articleItems = articleList.getElementsByTagName('tr');
    for(let i = 1; i < articleItems.length; i++) { // 从1开始跳过表头
      const item = articleItems[i];
      
      // 获取文章ID
      const linkElem = item.querySelector('a[href*="/admin/edit/"]');
      if(!linkElem) continue;
      
      const href = linkElem.getAttribute('href');
      const id = href.split('/').pop();
      
      // 在最后一个td内添加删除按钮
      const lastTd = item.querySelector('td:last-child');
      if(!lastTd) continue;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-sm delete-article';
      deleteBtn.setAttribute('data-id', id);
      deleteBtn.innerHTML = '删除';
      deleteBtn.style.marginLeft = '10px';
      
      lastTd.appendChild(deleteBtn);
    }
    
    // 添加删除按钮点击事件
    document.querySelectorAll('.delete-article').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const id = this.getAttribute('data-id');
        if(!id) return;
        
        if(confirm('确定要删除这篇文章吗？此操作不可恢复！')) {
          deleteArticle(id);
        }
      });
    });
  }
  
  // 删除文章API调用
  function deleteArticle(id) {
    fetch('/admin/delete/' + id, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      if(data.status === 'success') {
        alert('文章删除成功！');
        // 刷新页面显示最新文章列表
        location.reload();
      } else {
        alert('删除失败：' + (data.message || '未知错误'));
      }
    })
    .catch(error => {
      console.error('删除文章时出错:', error);
      alert('删除文章时出错，请查看控制台');
    });
  }
  
  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    renderArticleList();
  });
  </script>
  </body>`);
  
  return html;
}

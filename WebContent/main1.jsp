<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="java.util.Locale" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<%
request.setAttribute("user", session.getAttribute("user"));

Locale locale = RequestContextUtils.getLocale(request);
request.setAttribute("locale", locale);

String lang = request.getHeader("Accept-Language") == null ? "ko" : request.getHeader("Accept-Language");
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
		"http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
		<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
		<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
		<META HTTP-EQUIV="Expires" CONTENT="0">
       
	   <title>OKMindmap :: Design Your Mind!</title>
	   
	   <link rel="shortcut icon" href="${pageContext.request.contextPath}/favicon.ico?v=<%=updateTime%>" />
       
       	<!--CSS-->
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/main_style.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/reset.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/style_vertical.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
      
        <!--폰트-->
        <link href='http://fonts.googleapis.com/css?family=Noto+Sans:700' rel='stylesheet' type='text/css'>
		<link href="https://fonts.googleapis.com/css?family=Nanum+Gothic:400,700&display=swap&subset=korean" rel="stylesheet">
		<link href='http://fonts.googleapis.com/css?family=Yanone+Kaffeesatz' rel='stylesheet' type='text/css'>
		<link href='http://api.mobilis.co.kr/webfonts/css/?fontface=NanumBrushWeb' rel='stylesheet' type='text/css' />
		
    	<!--Google API-->
        <script src="http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        <script>			
			window.onload = function() {
				new google.translate.TranslateElement({
					pageLanguage: 'ko',
					includedLanguages: 'en,ja,zh-CN,zh-TW,ko',
					layout: google.translate.TranslateElement.InlineLayout.SIMPLE
				}, 'google_translate_element');			
			}
			
			var baseHeight=document.getElementById("boardframe").scrollHeight; 

			function resizeHeight(obj){
				thisHeight=obj.contentWindow.document.body.scrollHeight;

				if(thisHeight>baseHeight){
				obj.height=thisHeight;
				}else{
					obj.height=baseHeight;
				}
			}
		</script>
		
        <!-- The JavaScript -->
        <script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
        <script src="${pageContext.request.contextPath}/lib/jquery.easing.1.3.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
        <script type="text/javascript">
        
			function init(){
				
				// easing
	        	$('ul.nav a').bind('click',function(event){
	                var $anchor = $(this);
	                
	                $('html, body').stop().animate({
	                    scrollTop: $($anchor.attr('href')).offset().top
	                }, 1500,'easeInOutExpo');
	                /*
	                if you don't want to use the easing effects:
	                $('html, body').stop().animate({
	                    scrollTop: $($anchor.attr('href')).offset().top
	                }, 1000);
	                */
	                event.preventDefault();
	            });
				
	        }
	        
	        $(document).ready( init );
        </script>

    </head>
 
<body>
<%
 	if(lang.startsWith("ko")){
%>
		<%@include file="main_ko.jsp" %>
<% 
 	}else{
%>
 		<%@include file="main_en.jsp" %>
<%  		
 	}
 %>
       
<div id="footer">
    <p>(주)인튜브 | 서울시 성동구 성수이로 51, 1204호 (성수동2가, 서울숲 한라시그마 밸리) | 사업자등록번호 : 868-88-01475 <br> 대표자 : 이대현 | 대표전화 070.6956.0104 | support@intube.kr</p>
    <p>Copyright ⓒ intube.kr,Inc. All Rights Reserved</p>
</div>
<!-- Start of StatCounter Code for Default Guide -->
<script type="text/javascript">
var sc_project=7775078; 
var sc_invisible=1; 
var sc_security="aab0f358"; 
</script>
<script type="text/javascript" 
src="http://www.statcounter.com/counter/counter.js"></script>
<noscript><div class="statcounter"><a title="tumblr
tracker" href="http://statcounter.com/tumblr/" 
target="_blank"><img class="statcounter" 
src="http://c.statcounter.com/7775078/0/aab0f358/1/" 
alt="tumblr tracker"></a></div></noscript>
<!-- End of StatCounter Code for Default Guide -->

    </body>
</html>
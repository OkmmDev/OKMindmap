<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Locale"%>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils"%>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<%
	long updateTime = 0l;
	if (Configuration.getBoolean("okmindmap.debug")) {
		updateTime = System.currentTimeMillis() / 1000;
	} else {
		updateTime = Configuration.getLong("okmindmap.update.version");
	}
%>

<c:choose>
    <c:when test="${cookie['locale'].getValue() == 'en'}">
        <c:set var="locale" value="en" />
    </c:when>
    <c:when test="${cookie['locale'].getValue() == 'es'}">
		<c:set var="locale" value="es"/>
	</c:when>
    <c:when test="${cookie['locale'].getValue() == 'vi'}">
        <c:set var="locale" value="vi" />
    </c:when>
    <c:otherwise>
        <c:set var="locale" value="ko" />
    </c:otherwise>
</c:choose>

<fmt:setLocale value="${locale}" />

<!DOCTYPE html>
<html lang="${locale}">

<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="shortcut icon" href="${pageContext.request.contextPath}/theme/dist/images/favicon.png" />
    <!-- Theme -->
    <link rel="stylesheet" href="${pageContext.request.contextPath}/theme/dist/assets/css/app.css?v=<%=updateTime%>">
    <script src="${pageContext.request.contextPath}/theme/dist/assets/js/app.js?v=<%=updateTime%>"></script>

    <title>
        <spring:message code='menu.mindmap.changntitle' />
    </title>

    <script type="text/javascript">
        var loading = false;

        function isDuplicateMapName(mapTitle) {
            var params = {
                "mapTitle": mapTitle
            };
            var returnV = false;
            $.ajax({
                type: 'post',
                url: "${pageContext.request.contextPath}/mindmap/isDuplicateMapName.do",
                dataType: 'json',
                data: params,
                async: false,
                success: function (data) {
                    if (data.status == "ok") {
                        returnV = true;
                    } else {
                        returnV = false;
                    }
                }
            }
            );
            return returnV;
        }

        function changeMapName() {
            var title = $('#changemapname_title').val();

            if (title != parent.mapName) {
                if (!isDuplicateMapName(title)) {
                    alert("<spring:message code='message.mindmap.new.duplicate.mapName'/>");
                    $("#changemapname_title").focus();
                    return false;
                }

                loading = true;
                $('.btn').prop('disabled', true);

                var params = {
                    "mapId": parent.mapId,
                    "title": title
                };
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    async: false,
                    url: '${pageContext.request.contextPath}/mindmap/changeMap.do',
                    data: params,
                    success: function (data) {
                        parent.location.reload(true);
                    },
                    error: function (data, status, err) {
                        alert("changeMapName error : " + status);
                        loading = false;
                        $('.btn').prop('disabled', false);
                    }
                });
            }
        }

        $(document).ready(function () {
            if (!parent.jMap) window.location.href = '${pageContext.request.contextPath}';
            
            $('#changemapname_title').val(parent.jMap.cfg.mapName);
            $('#changemapname_title').select();

            $("#frm_confirm").submit(function (event) {
                event.preventDefault();
                if (!loading) changeMapName();
            });
        });
    </script>
</head>

<body>
    <div class="container-fluid py-1">
        <div class="mx-auto" style="max-width: 300px;">
            <form id="frm_confirm">
                <div class="form-group">
                    <label>
                        <spring:message code='common.title' />
                    </label>
                    <input type="text" autofocus required class="form-control" id="changemapname_title">
                </div>

                <div class="text-center">
                    <button type="submit" class="btn btn-primary btn-min-w btn-spinner">
                        <span class="spinner spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <spring:message code='button.apply' />
                    </button>
                </div>
            </form>
        </div>
    </div>

</body>

</html>
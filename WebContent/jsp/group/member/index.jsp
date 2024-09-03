<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="java.util.Locale"%>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils"%>
<%@ page import="com.okmindmap.configuration.Configuration"%>
<%@ page import="com.okmindmap.util.PagingHelper"%>
<%@ page import="java.util.HashMap"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<%
	Locale locale = RequestContextUtils.getLocale(request);
	request.setAttribute("locale", locale);

	long updateTime = 0l;
	if (Configuration.getBoolean("okmindmap.debug")) {
		updateTime = System.currentTimeMillis() / 1000;
	} else {
		updateTime = Configuration.getLong("okmindmap.update.version");
	}
%>

<!DOCTYPE html>
<html lang="${locale.language}">

<head>
	<!-- Required meta tags -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<link rel="shortcut icon" href="${pageContext.request.contextPath}/theme/dist/images/favicon.png" />
	<!-- Theme -->
	<link rel="stylesheet" href="${pageContext.request.contextPath}/theme/dist/assets/css/app.css?v=<%=updateTime%>">
	<script src="${pageContext.request.contextPath}/theme/dist/assets/js/app.js?v=<%=updateTime%>"></script>

	<title>
		<spring:message code='message.group.member.registered' />
	</title>

	<script>
		function goSearch() {
			var frm = document.searchf;
			frm.page.value = 1;
			frm.submit();
		}

		function goPage(v_curr_page) {
			var frm = document.searchf;
			frm.page.value = v_curr_page;
			frm.submit();
		}
	</script>

</head>

<body>
	<header>
		<div class="p-3">
			<div class="font-weight-bold h4">
				<img src="${pageContext.request.contextPath}/theme/dist/images/icons/users.svg" width="26px" class="mr-1 align-top">
				<span>
					<c:out value="${data.group.name}" />
				</span>
			</div>
			<spring:message code='message.group.member.registered' />
		</div>

		<div class="d-md-flex align-items-center py-2 px-3 bg-white">
			<div class="mr-auto">
				<a href="${pageContext.request.contextPath}/group/member/add.do?groupid=<c:out value='${data.group.id }'/>" class="mx-0 btn btn-secondary btn-min-w">
					<spring:message code='message.group.member.add.short' />
				</a>
			</div>
			<form method=post name="searchf" onsubmit="goSearch()">
				<input type="hidden" name="page" value="${data.page}">
				<input type="hidden" name="sort" value="${data.sort}">
				<input type="hidden" name="isAsc" value="${data.isAsc}">

				<div class="input-group my-1">
					<div class="input-group-prepend" style="max-width: 30%;">
						<select class="custom-select shadow-none btn" name="searchfield" id="searchfield">
							<option value="username" ${data.searchfield=="username" ? "selected" :""}>Id</option>
							<option value="fullname" ${data.searchfield=="fullname" ? "selected" :""}>
								<spring:message code='common.name' />
							</option>
						</select>
					</div>
					<input type="search" id="search" name="search" class="form-control shadow-none" placeholder="<spring:message code='common.search'/>" value="${data.search}">
					<div class="input-group-append">
						<button class="btn btn-light shadow-none border" type="submit">
							<img src="${pageContext.request.contextPath}/theme/dist/images/icons/search.svg" width="20px">
						</button>
					</div>
				</div>
			</form>
		</div>
	</header>
	<div class="container-fluid py-3">
		<c:choose>
			<c:when test="${(data.members != null and fn:length(data.members) > 0) or data.search != null}">
				<div class="table-responsive">
					<table class="table">
						<tbody>
							<c:forEach var="member" items="${data.members}">
								<tr>
									<td class="py-1">
										<div class="d-flex align-items-center">
											<div class="flex-shrink-1">
												<img src="${pageContext.request.contextPath}/user/avatar.do?userid=<c:out value='${member.user.id}' />" style="width: 34px; height: 34px;" class="rounded-circle">
											</div>
											<div class="px-3" style="max-width: 300px;">
												<div class="font-weight-bold text-truncate">
													<c:out value="${member.user.lastname}"></c:out>
													<c:out value="${member.user.firstname}"></c:out>
												</div>
												<div class="text-muted text-truncate">
													<small>
														Id: <c:out value="${member.user.password != 'not cached' ? member.user.username : '******'}"></c:out> -
														<spring:message code='common.email' />: <c:out value="${member.user.email}"></c:out>
													</small>
												</div>
											</div>
										</div>
									</td>
									<c:if test="${data.group.policy.shortName eq 'approval'}">
										<td class="py-3">
											<span class="badge badge-pill badge-gray-200 px-3 py-2">
												<c:out value="${member.memberStatus.name}" />
											</span>
										</td>
									</c:if>
									<td class="py-3">
										<div class="d-flex justify-content-end">
											<c:if test="${member.memberStatus.shortName eq 'waiting'}">
												<a href="${pageContext.request.contextPath}/group/member/status.do?id=<c:out value='${member.id}'/>&status=approved" class="mr-1 btn btn-success btn-sm">
													<img src="${pageContext.request.contextPath}/theme/dist/images/icons/user-check-w.svg" width="18px" class="mr-1">
													<spring:message code='button.approve' />
												</a>
											</c:if>
											<a href="${pageContext.request.contextPath}/group/member/remove.do?id=<c:out value='${member.id }'/>" class="btn btn-light btn-sm">
												<img src="${pageContext.request.contextPath}/theme/dist/images/icons/trash-2.svg" width="18px">
											</a>
										</div>
									</td>
								</tr>
							</c:forEach>
						</tbody>
					</table>
				</div>

				<div class="pagenum" style="text-align:center;padding-top:7px;">
					<%
						HashMap<String, Object> data = (HashMap) request.getAttribute("data");
						out.println(PagingHelper.instance.autoPaging((Integer)data.get("totalMembers"), (Integer)data.get("pagelimit"), (Integer)data.get("plPageRange"), (Integer)data.get("page")));
					%>
				</div>
			</c:when>
			<c:otherwise>
				<div class="alert alert-success text-center" role="alert">
					<spring:message code='message.group.member.emptyregistered' />
				</div>
			</c:otherwise>
		</c:choose>

		<div class="mt-3 text-center">
			<a href="${pageContext.request.contextPath}/group/list.do" class="mx-0 btn btn-dark btn-min-w">
				<img src="${pageContext.request.contextPath}/theme/dist/images/icons/arrow-left-w.svg" width="20px">
				<spring:message code='button.grouplist' />
			</a>
		</div>
	</div>
</body>

</html>
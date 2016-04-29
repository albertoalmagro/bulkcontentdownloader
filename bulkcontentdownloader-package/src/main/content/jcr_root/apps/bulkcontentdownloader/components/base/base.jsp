<%@include file="/libs/foundation/global.jsp" %><%

%><c:set var="pageTitle"
       value="<%= xssAPI.encodeForHTML(currentPage.getTitle()) %>" />

<c:set var="pagePath"
       value="<%= xssAPI.getValidHref(resourceResolver.map(slingRequest, currentPage.getPath())) %>"
       scope="request"/>

<c:set var="resourcePath"
       value="<%= xssAPI.getValidHref(resourceResolver.map(slingRequest, resource.getPath())) %>"
       scope="request"/>

<c:set var="clientLib"
       value="<%= xssAPI.encodeForHTMLAttr("bulkcontentdownloader-.app") %>"
       scope="request"/>

<c:set var="app"
       value="<%= xssAPI.encodeForHTMLAttr("bulkcontentdownloader-app") %>"
       scope="request"/>

<!doctype html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

        <title>${pageTitle} | Netcentric Tools</title>

        <cq:include script="includes/head-libs.jsp"/>
    </head>

    <body class="acs-tools-page">
        <header class="top">
            <div class="logo">
                <a href="/"><i class="icon-marketingcloud medium"></i></a>
            </div>

            <nav class="crumbs">
                <a href="/miscadmin">Tools</a>
                <a href="${pagePath}.html">${pageTitle}</a>
            </nav>
        </header>

        <div id="bulkcontentdownloader-app">
            <cq:include script="includes/notifications.jsp"/>

            <div class="page" role="main">
                <div class="content">
                    <div class="content-container">
                        <div class="content-container-inner">

                            <h1>${pageTitle}</h1>

                            <cq:include script="content.jsp"/>
                        </div>
                    </div>
                </div>
            </div>

            <cq:include script="includes/footer-libs.jsp"/>
        </div>
    </body>
</html>

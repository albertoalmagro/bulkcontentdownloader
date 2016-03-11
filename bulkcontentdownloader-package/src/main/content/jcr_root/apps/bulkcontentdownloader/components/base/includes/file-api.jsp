<%@include file="/libs/foundation/global.jsp" %><%

    pageContext.setAttribute("fileApiJS",
            resourceResolver.map(slingRequest, "/etc/clientlibs/acs-tools/vendor/FileAPI.min.js"));
    pageContext.setAttribute("fileApiSWF",
            resourceResolver.map(slingRequest, "/etc/clientlibs/acs-tools/vendor/FileAPI.min.js/FileAPI.flash.swf"));

%><script>
    // Need to be loaded before angular-file-upload-shim(.min).js
    FileAPI = {
        jsUrl: '${fileApiJS}',
        flashUrl: '${fileApiSWF}'
    }
</script>


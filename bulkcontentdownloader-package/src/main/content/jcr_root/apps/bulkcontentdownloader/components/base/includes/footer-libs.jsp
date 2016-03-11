<%@include file="/libs/foundation/global.jsp" %><%

%><cq:includeClientLib js="bulkcontentdownloader.base"/>
<cq:includeClientLib js="${clientLib}"/><%

%><%-- Register angular app; Decreases chances of collisions w other angular apps on the page (ex. via injection) --%><%

%><script type="text/javascript">
  angular.bootstrap(document.getElementById('${app}'), ['${app}']);
</script>

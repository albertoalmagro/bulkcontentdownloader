package biz.netcentric.bulkcontentdownloader;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.jackrabbit.vault.packaging.PackageManager;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;

/** Bean for BulkContentDownloader
 * 
 * @author albertoalmagro */
@Model(adaptables = SlingHttpServletRequest.class)
public class BulkContentDownloader {
    
    private static final String P_MAX_SIZE = "maxSize";
    private static final String P_PATH = "path";

    private String maxSize;
    private String[] paths;

    @SlingObject
    protected SlingHttpServletRequest request;

    @OSGiService
    private PackageManager packageManager;

    @PostConstruct
    public void init() {
        this.maxSize = this.request.getParameter(P_MAX_SIZE);
        this.paths = this.request.getParameterValues(P_PATH);
    }

    public boolean isHasContent() {
        return StringUtils.isNotBlank(this.maxSize) && this.isPathsEmpty();
    }

    private boolean isPathsEmpty() {
        return this.paths != null && StringUtils.isNotBlank(this.paths[0]);
    }

    public String getSayHello() {
        return "Hello world";
    }
    
    public String getMaxSize() {
        return this.maxSize;
    }

    public String[] getPaths() {
        return this.paths;
    }

}

/*
 *  Copyright 2015 Adobe Systems Incorporated
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package com.mysite.core.models;

import static org.apache.sling.api.resource.ResourceResolver.PROPERTY_RESOURCE_TYPE;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.models.annotations.Default;
import org.apache.sling.models.annotations.Exporter;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.InjectionStrategy;
import org.apache.sling.models.annotations.injectorspecific.OSGiService;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Optional;

import org.apache.sling.models.factory.ExportException;
import org.apache.sling.models.factory.MissingExporterException;
import org.apache.sling.models.factory.ModelFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.sling.api.SlingHttpServletRequest;


@Model(adaptables = {Resource.class, SlingHttpServletRequest.class})
public class TestModel {

    //@ValueMapValue(name=PROPERTY_RESOURCE_TYPE, injectionStrategy=InjectionStrategy.OPTIONAL)
   // @Default(values="No resourceType")
   // protected String resourceType;
 private final Logger logger = LoggerFactory.getLogger(getClass());

    @SlingObject
    private Resource currentResource;
    @SlingObject
    private ResourceResolver resourceResolver;
    @SlingObject
    private SlingHttpServletRequest request;

    private String message;

    @javax.inject.Inject 
    private ModelFactory modelFactory;

    private String modelJson = "{}";
    

    @PostConstruct
    protected void init() {
        ///PageManager pageManager = resourceResolver.adaptTo(PageManager.class);
        /*String currentPagePath = Optional.ofNullable(pageManager)
                .map(pm -> pm.getContainingPage(currentResource))
                .map(Page::getPath).orElse("");*/

                

                com.adobe.cq.wcm.core.components.models.Page pagemodel = modelFactory.getModelFromWrappedRequest(request, currentResource, com.adobe.cq.wcm.core.components.models.Page.class);

                try {
                String output = modelFactory.exportModel(pagemodel, "jackson", String.class, new HashMap<String, String>());

                logger.info("output text {}", output);

                ObjectMapper mapper = new ObjectMapper();
                
                    modelJson = mapper.writeValueAsString(pagemodel);
                  logger.info("model text {}", modelJson);
                } catch (JsonProcessingException |ExportException | MissingExporterException e) {
                   
                    e.printStackTrace();
                }
        message = "Hello World!\n"
            + "Resource type is: " + currentResource.getPath() + "\n"
            + "Current page is:  " + pagemodel.getClass().getName() + "\n";
    }

    public String getMessage() {
        return message;
    }

    public String getModelJson() {
        return modelJson;
    }
}

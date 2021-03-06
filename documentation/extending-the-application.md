# Extending the application for specific domains

- [Extending the application for specific domains](#extending-the-application-for-specific-domains)
  - [Data specific view components](#data-specific-view-components)
    - [Adding a data specific renderer](#adding-a-data-specific-renderer)
    - [Getting started with your own renderer](#getting-started-with-your-own-renderer)
  - [Domain specific introduction, header, footer, explore etc components.](#domain-specific-introduction-header-footer-explore-etc-components)
  
This application is designed to be extensible to specific domains. That is, if you want to
use the application for a deployment with only one set of data (e.g. paradisec data) you can provide
the components that are suited for that type of data and tell the application to use only those
components. The way to configure this is defined in [Configuring the application]('configuring-the-application.md').

## Data specific view components

The UI has been designed to be extensible to various incoming data formats. Specifically, if a mapping is defined for a particular type of data that component will be used to render it. Otherwise, a simple generic renderer will be used

### Adding a data specific renderer

A renderer can be added as follows:

-   Create a folder named as the domain in `ui/src/components/domain/`.
-   Create the component in that folder.
-   Add a mapping for that component in to the renderers property in the main configuration file. You can load a renderer based on the `domain` of the data or the `domain` and `@type` and / or `additionalType`. Using PARADISEC as an example the domain is paradisec.org.au and the additionalType is one of item or collection.

When instantiated the component will be passed a data object with a signature as follows:

```
{
    additionalType,         # if defined - the type of the data
    dataTypes,              # the datatypes contained in this object (images, audio, video etc)
    datafiles,              # the datafiles in the OCFL object keyed on file name
    domain,                 # the domain of the data
    flattenedCrate,         # the flattenedCrate
    inventory,              # the OCFL inventory
    objectifiedCrate,       # the crate as an object
    path,                   # the path of the object relative to the root
    version,                # the current version of the ocflObject that has been loaded
    versions,               # all of the available versions
}
```

The signature of the component itself must be as follows:

```
<script>
export default {
    props: {
        data: {
            type: Object,
            required: true
        }
    }
}
</script>
```

### Getting started with your own renderer

Check out `domain/paradisec.org.au/renderers/ItemViewer.component.vue` as well as `domain/paradisec.org.au/renderers/RenderContent.component.vue`.

## Domain specific introduction, header, footer, explore etc components.

As with the data specific view components, you can build your own introduction and explore components and tell
the app to load those. The repo layout is the same as it is for view. Create a folder named as your domain
(which equates to your installation) and define your component and everything it needs in there. You can
use shared components if you want or define your own set as required.
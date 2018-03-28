# New New World

This is the birth of a thirsty application

<p align="center">
    <img alt='Thirsty Thursday (via GIPHY)' src="https://media.giphy.com/media/afFg1TjbR9s2I/giphy.gif"/>
</p>


<p>Soil data was sourced using the SoilGrids API. 
        This allowed us to pass in the geocodes of the  Wine Enthusiast data and 
        return robust soil sample results. SoilGrids provides global predictions 
        for standard numeric soil properties (organic carbon, bulk density, 
        Cation Exchange Capacity (CEC), pH, soil texture fractions and coarse fragments)
         at seven standard depths (0, 5, 15, 30, 60, 100 and 200 cm), in addition to 
         predictions of depth to bedrock and distribution of soil classes based on the 
         World Reference Base (WRB) and USDA classification systems.
        <br>
        <br>
        After researching soil attributes in relation to viniculture, we decided 
        to capture fields cited to be factors in producing great wine. We chose 
        organic carbon, bulk density, CEC, pH, water at wilting point, and clay 
        contents at a depth of 60cm. We chose 60 cm as 60% of vine root growth 
        occurs in the top 24 inches of soil.  
        </p>
        <br>
        <img src="../../images/attr.png" alt="attributes">
        <br>
        <p>
        We then looped through all Wine Enthusiast coordinates to gather results 
        for each reviewed Sauvignon Blanc and create a new dataframe of soil data. 
        </p>
        <br>
        <img src="../../images/loop.png" alt="for loop">
        <br>
        <p>For more info on the SoilGrids API:</p> 
        <a href="https://rest.soilgrids.org/index.html" target="_blank"><img src="https://rest.soilgrids.org/static/SoilGrids_banner_REST_200px.png" 
            class="img-responsive" alt="SoilGrids banner"></a>

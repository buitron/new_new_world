## New New World

<p align="center">
    <img alt='Thirsty Thursday (via GIPHY)' src="https://media.giphy.com/media/afFg1TjbR9s2I/giphy.gif"/>
</p>


# Objective

Discover which environmental properties are prime for Sauvignon Blanc grape cultivation and develop a web application for users to interact with and gather relevant data on a specified location.


# Background

#### Why Sauvignon Blanc (SB)?
SB the most popular and most profitable wine

#### What are the various geographical locations in which SB currently thrives?


#### What is the soil composition at those regions?


#### How is the weather condition at those locations?
Sauvignon blanc is a green-skinned grape variety that originates from the Bordeaux region of France. The grape most likely gets its name from the French words sauvage ("wild") and blanc ("white") due to its early origins as an indigenous grape in South West France.
Sauvignon blanc is widely cultivated in France, Chile, Canada, Australia, New Zealand, South Africa, the states of Washington and California in the US.
Diurnal temperature variation: the difference between the highest temperature of the day and the lowest temperature of the night. This variation in temperatures has a significant impact on a grape's ripening pattern; the heat of the day promotes sugar accumulation, while the cooler night-time temperatures preserves acidity level
French winemakers prefer warmer fermentations (around 16-18 °C) that bring out the mineral flavors in the wine while New World winemakers prefer slightly colder temperatures to bring out more fruit and tropical flavors.

Wine Enthusiast :
Used Splinter to gather rating data on Sauvignon Blanc wines produced in 2016.
Used Splinter to pass in wine rating locations to www.gps-coordinates.net to gather geocodes
SoilGrids :
Pass in geocodes from Wine Enthusiast to the SoilGrids API. After researching soil attributes in relation to viniculture, we decided to capture fields cited to be factors in producing great wine.
World Weather Online
Pass in geocodes from Wine Enthusiast and gather daily weather metrics for all months in 2016
Normalizing:
Joined ratings, soil, and weather date then cleaned dataset by removing null values and normalized fields to 1-100 scale
Correlation:
Calculated with added values of ‘un-ideal’ locations and identified humidity, variance between min and max during growing season, and yearly variation f min and max to have the strongest correlations with wine ratings


---

---


## Step 1 - Data Gathering


## Step 2 - Data Pre-Processing


## Step 3 - Data Analysis


## Step 4 - Application Build


---

---

## Sample Page

![page1](images/page_1.png)
![page2](images/page_2.png)
![page3](images/page_3.png)
![page4](images/page_4.png)
![page5](images/page_5.png)
![page6](images/page_6.png)
![page7](images/page_7.png)
![page8](images/page_8.png)
![page9](images/page_9.png)
![page10](images/page_10.png)
![page11](images/page_11.png)

# Live Heroku Web-application
## Click [HERE](https://sauvignon-blanc-opt.herokuapp.com/) to play!


import requests as req


def process(geo_coords):
    key = 'd018de65354847b096d232619182203'

    lat = float(geo_coords.split(',')[0].replace(' ', ''))
    lon = float(geo_coords.split(',')[1].replace(' ', ''))
    _2016 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

    insert = {}

    for j in range(12):

        date = '2016-{}-01'.format(j + 1)
        enddate = '2016-{}-{}'.format(j + 1, _2016[j])

        url = 'http://api.worldweatheronline.com/premium/v1/past-weather.ashx?' + 'key={}'.format(key) + '&q={},{}'.format(lat, lon) + '&date={}'.format(date) + '&enddate={}'.format(enddate) + '&tp=24&format=json'
        r = req.get(url, timeout=5)

        if r.status_code == 200:
            response = r.json()

            max_temp = []
            min_temp = []
            precip = []
            humid = []

            days = len(response['data']['weather'])

            for k in range(days):
                max_temp.append(float(response['data']['weather'][k]['maxtempF']))
                min_temp.append(float(response['data']['weather'][k]['mintempF']))
                precip.append(float(response['data']['weather'][k]['hourly'][0]['precipMM']) * 0.0393700787)
                humid.append(float(response['data']['weather'][k]['hourly'][0]['humidity']))

            insert['{}_avg_max_tempF'.format(month[j])] = round(sum(max_temp) / days, 2)
            insert['{}_avg_min_tempF'.format(month[j])] = round(sum(min_temp) / days, 2)
            insert['{}_precipIn'.format(month[j])] = round(sum(precip) / days, 2)
            insert['{}_humidPerc'.format(month[j])] = round(sum(humid) / days, 2)

    attr = 'ORCDRC,CLYPPT,PHIHOX,AWC,CEC,WWP,BLDFIE'
    depth = 'sl5'

    url = 'https://rest.soilgrids.org/query?' + 'lon={}'.format(lon) + "&lat={}".format(lat) + "&attributes={}".format(attr) + "&depths={}".format(depth)
    r = req.get(url, timeout=5)

    if r.status_code == 200:
        response = r.json()

        carbon = response['properties']['ORCDRC']['M'][depth]
        clay = response['properties']['CLYPPT']['M'][depth]
        ph = response['properties']['PHIHOX']['M'][depth]
        cec = response['properties']['CECSOL']['M'][depth]
        water_wp = response['properties']['WWP']['M'][depth]
        bulk = response['properties']['BLDFIE']['M'][depth]
        date = response['properties']['publication_date']

        insert['carbon'] = carbon
        insert['clay'] = clay
        insert['ph'] = ph
        insert['cec'] = cec
        insert['water_wp'] = water_wp
        insert['bulk'] = bulk
        insert['publish_date'] = date
        insert['lat_lon'] = '{}, {}'.format(lat, lon)


    return insert


def convert(user_input):
    pass



import json
import csv

with open('../DataVisualization2016/Data/gem2015.csv', 'rb') as mycsvfile:
    thedata = csv.reader(mycsvfile)
    # for row in thedata:
    #     print(row[0]+"\t \t"+row[1]+"\t \t"+row[2]+"\t \t"+row[3]+"\t \t"+row[4])

    with open('nlgemeenten2009.json') as json_data:
        d = json.load(json_data)
    for row in thedata:
        for gemeente in d['objects']['gemeenten']['geometries']:
            # print gemeente['properties']['gemeente']
            if row[1] == gemeente['properties']['gemeente']:
                gemeente['properties']['inwoners'] = row[5]
                gemeente['properties']['man'] = row[6]
                gemeente['properties']['vrouw'] = row[7]
                gemeente['properties']['bev dichtheid'] = row[21]
                gemeente['properties']['aantal hectare'] = row[22]
                gemeente['properties']['aantal woningen'] = row[42]
        # print d['objects']['gemeenten']

# print(d['objects']['gemeenten']['geometries'][6])


    with open('output.json', 'w') as outfile:
        json.dump(d, outfile)

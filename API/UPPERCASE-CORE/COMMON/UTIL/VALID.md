# `CLASS` global.VALID
데이터를 검증하고, 어떤 부분이 잘못되었는지 오류를 확인할 수 있는 VALID 클래스

## Parameters
* `REQUIRED` validDataSet 

## Static Members

### notEmpty
not empty.
###### Parameters
* `REQUIRED` value 

### regex
regex.
###### Parameters
* `REQUIRED` params 
* `REQUIRED` params.value 
* `REQUIRED` params.pattern 

### size
size.
###### Parameters
* `REQUIRED` params 
* `REQUIRED` params.value 
* `OPTIONAL` params.min 
* `REQUIRED` params.max 

### integer
integer.
###### Parameters
* `REQUIRED` value 

### real
real.
###### Parameters
* `REQUIRED` value 

### bool
bool.
###### Parameters
* `REQUIRED` value 

### date
date.
###### Parameters
* `REQUIRED` value 

### min
min.
###### Parameters
* `REQUIRED` params 
* `REQUIRED` params.value 
* `REQUIRED` params.min 

### max
max.
###### Parameters
* `REQUIRED` params 
* `REQUIRED` params.value 
* `REQUIRED` params.max 

### email
email.
###### Parameters
* `REQUIRED` value 

### png
png.
###### Parameters
* `REQUIRED` value 

### url
url.
###### Parameters
* `REQUIRED` value 

### username
username.
###### Parameters
* `REQUIRED` value 

### id
id.
###### Parameters
* `REQUIRED` value 

### one
one.
###### Parameters
* `REQUIRED` params 
* `REQUIRED` params.value 
* `REQUIRED` params.array 

### array
array.
###### Parameters
* `REQUIRED` value 

### data
data.
###### Parameters
* `REQUIRED` value 

### element
element.
###### Parameters
* `REQUIRED` params 
* `REQUIRED` params.array 
* `REQUIRED` params.validData 
* `OPTIONAL` params.isToWash 

### property
property.
###### Parameters
* `REQUIRED` params 
* `REQUIRED` params.data 
* `REQUIRED` params.validData 
* `OPTIONAL` params.isToWash 

### detail
detail.
###### Parameters
* `REQUIRED` params 
* `REQUIRED` params.data 
* `REQUIRED` params.validDataSet 
* `OPTIONAL` params.isToWash 

### equal
equal.
###### Parameters
* `REQUIRED` params 
* `REQUIRED` params.value 
* `REQUIRED` params.validValue 

## Public Members

### check
check.
###### Parameters
No parameters.

### checkAndWash
check and wash.
###### Parameters
No parameters.

### checkForUpdate
check for update.
###### Parameters
No parameters.

### getValidDataSet
get valid data set.
###### Parameters
No parameters.
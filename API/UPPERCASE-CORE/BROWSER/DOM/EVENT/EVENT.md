# `CLASS` global.EVENT
노드의 이벤트 처리를 담당하는 EVENT 클래스

## Parameters
* `REQUIRED` nameOrParams 
* `OPTIONAL` nameOrParams.node		이벤트를  등록 및 적용할 노드
* `OPTIONAL` nameOrParams.lowNode	이벤트  '등록'은 node 파라미터에 지정된 노드에 하지만, 실제 이벤트의 동작을 '적용'할 노드는 다른 경우 해당 노드
* `REQUIRED` nameOrParams.name		이벤트  이름
* `REQUIRED` eventHandler 

## Static Members

### fireAll
#### Parameters
* `REQUIRED` nameOrParams 
* `OPTIONAL` nameOrParams.node	이벤트가  등록된 노드
* `REQUIRED` nameOrParams.name	이벤트  이름

### removeAll
#### Parameters
* `OPTIONAL` nameOrParams 
* `OPTIONAL` nameOrParams.node	이벤트가  등록된 노드
* `OPTIONAL` nameOrParams.name	이벤트  이름

### remove
#### Parameters
* `REQUIRED` nameOrParams 
* `OPTIONAL` nameOrParams.node	이벤트가  등록된 노드
* `REQUIRED` nameOrParams.name	이벤트  이름
* `REQUIRED` eventHandler 

## Public Members

### remove
#### Parameters
No parameters.

### fire
#### Parameters
No parameters.

### getEventHandler
#### Parameters
No parameters.
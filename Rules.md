# 约定

## tips

- golang打包go模板时，里面存在go.mod会忽略整个文件夹，需要改名。

## 目录

### 规则目录

[rules](mao/assets/rules)目录中存放了所有的自定义规则文件，每个文件都是一个json文件，文件名称就是模板的文件夹名称。

### 模板目录

[templates](mao/assets/template)目录中存放了所有的模板项目，每个文件夹就是一个模板项目，文件夹名称就是模板的名称。

## 规则

### 文件名与模板名称

mao/assets/rules/{模板名称}.json 规则文件
mao/assets/template/{模板名称} 模板目录

### 规则文件

#### 文件名\路径名替换

##### 例子

这个例子会将模板项目中的go.modd关键字替换为go.mod关键字，实际就是修改了最后的文件名称。支持关键字也支持完整路径。完整路径由对应模板项目的路径开始例如`go.modd`,就是对应模板项目的根目录下的`go.modd`文件。

```json
    "path": [
        {
            "source": "go.modd",
            "target": "go.mod"
        }
    ]
```

###### source

模板项目的完整路径、文件名称、关键字

###### target

输出的时候会将source中的关键字替换为target中的关键字

#### 文件中变量替换

这个参考golang的[template](https://pkg.go.dev/text/template)标准库

##### 例子

在这里写入需要进行模板渲染的文件路径，type为file时必须指定key。

- filePath 模板项目中的文件路径，例如`main.go`
- type 变量类型，目前支持`text`、`file`，为空的话默认值为`text`
- key 变量名称，目前只在类型为file时生效

```json
"variable": [
        {
            "filePath": "main.go"
        },
        {
            "key": "HelloFile",
            "type": "file",
            "filePath": "public/static/HelloFile.docx"
        }
    ]
```

### 前端

#### 组件

目前前端组件都是输入相关的。  

- text
- file
- select
- checkbox

#### 规则

##### 例子

变量key必须全局唯一,不能重复。

```json
"components": [
        {
            "label": "Hello Text?",
            "tips": "你好文字",
            "type": "text",
            "key": "HelloText",
            "validate": {
                "required": true,
                "ValidatorExpr": {
                    "type": "pattern",
                    "rule": "^[^0-9]*",
                    "message": "Hello 不可为数字"
                }
            }
        },
        {
            "label": "Hello File?",
            "tips": "你好文件",
            "type": "file",
            "key": "HelloFile",
            "validate": {
                "required": true
            }
        },
        {
            "label": "Hello Select?",
            "tips": "你好下拉框",
            "type": "select",
            "options": [
                {
                    "lable": "下拉框1",
                    "value": "下拉框value1"
                },
                {
                    "lable": "下拉框2",
                    "value": "下拉框value2",
                    "default": true
                }
            ],
            "key": "HelloSelect",
            "validate": {
                "required": true
            }
        },
        {
            "label": "Hello Checkbox?",
            "tips": "你好多选框",
            "type": "checkbox",
            "options": [
                {
                    "lable": "多选框1",
                    "value": "多选框value1",
                    "required": true
                },
                {
                    "lable": "多选框2",
                    "value": "多选框value2"
                }
            ],
            "key": "HelloCheckbox"
        }
    ],
```

##### 生成逻辑

生成顺序与components数组顺序一致

- key 是向后端传递的参数名
- label 是前端显示的名称
- tips 是前端显示的提示信息
- type 是前端组件的类型

##### 校验

###### 简单校验

- required 是必填项校验，例如`true`

###### 自定义校验

目前只支持正则校验，也就是 `type` = "pattern"，message 是校验失败时显示的提示信息。

```json
"validate": {
                "required": true,
                "ValidatorExpr": {
                    "type": "pattern",
                    "rule": "^[^0-9]*",
                    "message": "Hello 不可为数字"
                }
            }
```

## 渲染数据钩子函数

在关键位置对数据做个处理再往下一步

### 提交前

在你点击提交后，数据还没到wsam的适合先对数据做个处理，对输入的数据做个补充。  
js的文件名为规则文件的文件名，钩子函数名为porcess+字段的key。然后手动在index.js中导入下你的函数。
其中的processGlobal会在每个key的hook处理后在执行。

举个例子，我要把多选框中的数据做个处理。

[go_web.js](mao/assets/process/go_web.js)

```javaScript
/**
 * 
 * @param { {type:String,value:String | String []}} data 
 * @returns {{type:String,value:any}}
 */
function porcessHelloCheckbox(data) {
    if (Array.isArray(data.value)) {
        return {
            type: 'text',
            value: data.value.join(",")
        }
    } else {
        return data
    }
}

/**
 * 
 * @param {{key:String,value:{type:String,value:String | String []}}} data 
 * @returns {{key:String,value:{type:String,value:any}}}
 */
function processGlobal(data) {
    return data

}

export default {
    porcessHelloCheckbox,
    processGlobal
}
```

[index.js](mao/assets/process/index.js)

```javaScript
import go_web from "./go_web.js"

const DataProcess = {
    go_web
}

export default DataProcess
```

### 渲染时

还没想好要怎么处理

## 记录

```js
// 表达式直接返回校验结果（布尔值）
const rule = {
  customValidatorExpr: `typeof str !== 'string' && str.trim() === '' && isNaN(Number(value))`
};
// validator 是一个直接返回校验结果的函数
const validator = new Function('value', 'formValues', `return ${rule.customValidatorExpr};`);

// 直接调用 validator 即可得到结果
console.log(validator('123', { password: '123' })); // true
console.log(validator('456', { password: '123' })); // false

```

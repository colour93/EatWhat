## 功能需求

- 空格查询
- 十连抽
- 分割json

### 数据库结构

```json
{
    "shopName": "0090",
    "schoolName": "河北软件职业技术学院",
    "schoolId": 1,
    "tag": ["快餐"],
    "delivery": true,
    "shopId": 10002,
    "food": [
        {
            "itemName": "汉堡",
            "itemId": 1000210003,
            "price": 9
        }
    ],
    "drink": [
        {
            "itemName": "可乐",
            "itemId": 1000220003,
            "price": 4
        }
    ]
}
```

```json
{
    "schoolId": 1,
    "schoolName": "河北软件职业技术学院",
    "keywords": ["河软", "HBSI"]
}
```

### 请求路径以及结构

#### 奇奇怪怪的接口

##### bing壁纸

GET /bing

```JSON
{
    "code": 100,
    "msg": "success",
    "data": {
        "url": "https://cn.bing.com/th?id=OHR.CorkscrewSwamp_ZH-CN2637396790_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp"
    }
}
```

#### 管理操作

##### 添加学校

POST /manage/school/add (鉴权)

请求体

| 参数       | 必选 | 备注                       |
| ---------- | ---- | -------------------------- |
| schoolName | 是   | 学校名称                   |
| keywords   | 是   | 搜索关键字，以半角逗号分隔 |

返回体

```JSON
{
    "code": 100,
    "msg": "success",
    "data": {
        "schoolId": 3,
        "schoolName": "2312312",
        "keywords": [
            "河3333大"
        ],
        "_id": "6194a054f1a1312a4e4509f4",
        "__v": 0
    }
}
```

##### 添加店铺

POST /manage/shop/add (鉴权)

请求体

| 参数     | 必选 | 备注                  |
| -------- | ---- | --------------------- |
| shopName | 是   | 店铺名称              |
| schoolId | 是   | 学校id                |
| tag      | 是   | 标签，半角逗号分隔    |
| delivery | 是   | 是否支持外卖，1 0表示 |

返回体示例

```JSON
{
    "code": 100,
    "msg": "success",
    "data": {
        "shopName": "0090",
        "shopId": 10002,
        "schoolName": "河北软件职业技术学院",
        "schoolId": 1,
        "tag": [
            "汉堡",
            "快餐"
        ],
        "delivery": 1,
        "_id": "618f7d1c96c556413c2a75ce",
        "food": [],
        "drink": [],
        "__v": 0
    }
}
```

##### 增加商品

POST /manage/item/add (鉴权)

请求体

| 参数     | 必选 | 备注             |
| -------- | ---- | ---------------- |
| itemName | 是   | 食品/饮品名称    |
| price    | 否   | 价格             |
| shopId   | 是   | 店铺id           |
| type     | 是   | 类型，food/drink |

返回体

```JSON
{
    "code": 100,
    "msg": "success",
    "data": {
        "shopName": "小燕子烤冷面手抓饼",
        "shopId": 10003,
        "schoolName": "河北软件职业技术学院",
        "schoolId": 1,
        "tag": [
            "烤冷面",
            "手抓饼",
            "早餐"
        ],
        "delivery": true,
        "new": {
            "itemName": "小份烤冷面",
            "itemId": 1000310023,
            "price": 6,
            "ts": 1637066008661,
            "_id": "6193a5187143447c8dfd17ea"
        },
        "newType": "食品"
    }
}
```

##### 获取学校列表

GET /manage/school/list (鉴权)

返回体

```JSON
{
    "code": 100,
    "msg": "success",
    "data": [
        {
            "_id": "618f25e2fe79a91abb991688",
            "schoolId": 1,
            "schoolName": "河北软件职业技术学院",
            "keywords": [
                "HBSI",
                "河软"
            ],
            "__v": 0
        },
        {
            "_id": "618f2cbd3fbbbe5aae75d7cb",
            "schoolId": 2,
            "schoolName": "河北大学",
            "keywords": [
                "河大"
            ],
            "__v": 0
        }
    ]
}
```

##### 获取店铺列表

GET /manage/shop/list (鉴权)

```JSON
{
    "code": 100,
    "msg": "success",
    "data": [
        {
            "_id": "619058be1d55aadf0ade717f",
            "shopName": "0090",
            "shopId": 10001,
            "schoolName": "河北软件职业技术学院",
            "schoolId": 1,
            "tag": [
                "汉堡",
                "快餐"
            ],
            "delivery": true,
            "__v": 0
        },
        {
            "_id": "619059bebf4635033f850733",
            "shopName": "呱呱叫冰淇淋（汉堡炸鸡）",
            "shopId": 10002,
            "schoolName": "河北软件职业技术学院",
            "schoolId": 1,
            "tag": [
                "汉堡",
                "快餐",
                "炸鸡"
            ],
            "delivery": true,
            "__v": 0
        },
        {
            "_id": "61905a49bf4635033f850749",
            "shopName": "小燕子烤冷面手抓饼",
            "shopId": 10003,
            "schoolName": "河北软件职业技术学院",
            "schoolId": 1,
            "tag": [
                "烤冷面",
                "手抓饼",
                "早餐"
            ],
            "delivery": true,
            "__v": 0
        }
    ]
}
```

##### 获取商品列表

GET /manage/item/list (鉴权)

请求体

| 查询字符串 | 必选 | 备注   |
| ---------- | ---- | ------ |
| shopId     | 是   | 店铺id |

返回体

```JSON
{
    "code": 100,
    "msg": "success",
    "data": {
        "_id": "619059bebf4635033f850733",
        "shopName": "呱呱叫冰淇淋（汉堡炸鸡）",
        "shopId": 10002,
        "schoolName": "河北软件职业技术学院",
        "schoolId": 1,
        "tag": [
            "汉堡",
            "快餐",
            "炸鸡"
        ],
        "delivery": true,
        "food": [
            {
                "itemName": "韩式炸鸡 + 可乐",
                "itemId": 1000210001,
                "price": 24,
                "_id": "619059eabf4635033f850736"
            },
            {
                "itemName": "奥尔良炸鸡 + 可乐 * 2",
                "itemId": 1000210002,
                "price": 25,
                "_id": "61905a1bbf4635033f85073b"
            },
            {
                "itemName": "炸鸡 + 汉堡 + 可乐",
                "itemId": 1000210003,
                "price": 29,
                "_id": "61905a2bbf4635033f850742"
            },
            {
                "itemName": "测试",
                "itemId": 1000210004,
                "price": 121,
                "ts": 1637066325823,
                "_id": "6193a65549c3eb018a4ae1cf"
            }
        ],
        "drink": [],
        "__v": 0
    }
}
```

##### 删除学校

DELETE /manage/school/delete (鉴权)

请求体

| 参数     | 必选 | 备注   |
| :------- | ---- | ------ |
| schoolId | 是   | 学校id |

返回体

```JSON
{
    "code": 100,
    "msg": "success"
}
```

##### 删除店铺

DELETE /manage/shop/delete (鉴权)

请求体

| 参数   | 必选 | 备注   |
| ------ | ---- | ------ |
| shopId | 是   | 店铺id |

返回体

```JSON
{
    "code": 100,
    "msg": "success"
}
```

#### 普通操作

##### 搜索学校

GET /searchSchool

查询字符串

| 查询字符串 | 必选 | 备注   |
| ---------- | ---- | ------ |
| keyword    | 是   | 关键字 |

返回体

```JSON
{
    "code": 100,
    "msg": "success",
    "data": {
        "byExact": {
            "schoolId": 1,
            "schoolName": "河北软件职业技术学院",
            "keywords": [
                "HBSI",
                "河软"
            ]
        }
    }
}
```

##### 搜索店铺

GET /searchShop

请求体

| 查询字符串 | 必选 | 备注                                                     |
| ---------- | ---- | -------------------------------------------------------- |
| keyword    | 是   | 关键字                                                   |
| type       | 否   | 查询模式，默认为店铺名查询。1，店铺名模式；2，标签模式。 |

返回体

```JSON
{
    "code": 100,
    "msg": "success",
    "data": [
        {
            "shopName": "0090",
            "shopId": 10002,
            "schoolName": "河北软件职业技术学院",
            "schoolId": 1,
            "tag": [
                "汉堡",
                "快餐"
            ],
            "delivery": true,
            "food": [],
            "drink": []
        }
    ]
}
```

##### 抽卡

GET /get/:type

路径

| 路径参数 | 必选 | 备注       |
| -------- | ---- | ---------- |
| type     | 是   | food/drink |

请求体

| 查询字符串 | 必选               | 备注                                                         |
| ---------- | ------------------ | ------------------------------------------------------------ |
| count      | 否                 | 返回个数，默认为1，类型不正确时也为1，最大为15               |
| type       | 否                 | 查询类型，默认为0。0，无限制随机抽卡；1，按照tag查找；2，按照店铺id查找；3，按照商品名称模糊查找 |
| keyword    | 否，type填写后必选 | 搭配type使用                                                 |

算法说明：

受限于mongo的结构，N连抽时，先随机选取N个商家，然后集合这N个商家中的所有商品，随机抽取N个

返回体

```JSON
{
    "code": 100,
    "msg": "success",
    "data": [
        {
            "shopName": "小燕子烤冷面手抓饼",
            "shopId": 10003,
            "schoolName": "河北软件职业技术学院",
            "schoolId": 1,
            "tag": [
                "烤冷面",
                "手抓饼",
                "早餐"
            ],
            "delivery": true,
            "food": {
                "itemName": "小份烤冷面",
                "itemId": 1000310002,
                "price": 6
            }
        },
        {
            "shopName": "小燕子烤冷面手抓饼",
            "shopId": 10003,
            "schoolName": "河北软件职业技术学院",
            "schoolId": 1,
            "tag": [
                "烤冷面",
                "手抓饼",
                "早餐"
            ],
            "delivery": true,
            "food": {
                "itemName": "大份烤冷面 + 肠 + 金针菇",
                "itemId": 1000310001,
                "price": 11
            }
        }
    ]
}
```

#### 
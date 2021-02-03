package com.example.kotlindemo.bean

data class userData(
    var list: List<User>? = null
)

data class User(
    var age: String? = null,
    var userName: String? = null
)

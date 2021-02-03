package com.example.kotlindemo.dao

import androidx.room.TypeConverters

@TypeConverters(BookConverters::class)
data class InBean(
    var studentID: Long?,

    var emp_id: Long?,

    var s_name: String?,

    var s_type: String?,

    val city: String?,

    val post_code: Int,

    var t_id: Long?,

    var t_name: String?,

    var t_year: String?,
    var subject: String?,
    var sList1: List<Book>?
)


//studentID,emp_id,s_name,s_type,city,post_code,t_id,t_name,t_year,subject
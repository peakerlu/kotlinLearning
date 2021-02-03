package com.example.kotlindemo.dao

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.TypeConverters


@Entity(tableName = "Teacher")
@TypeConverters(BookConverters::class,PenConverters::class)
data class Teacher(
    @PrimaryKey(autoGenerate = true)
    @ColumnInfo(name = "t_id")
    var teacherId: Long?,
    @ColumnInfo(name = "t_name")
    var teacherName: String?,
    @ColumnInfo(name = "t_year")
    var teacherYear: String?,
    var subject: String?,
    var sList1: List<Book>?

//    var sList2: List<Pen>?
)

data class Book(
    var BookName: String?,
    var BookPrice: String?,
    var sList2: List<Pen>?
)

data class Pen(
    var PenName: String?
)
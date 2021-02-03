package com.example.kotlindemo.dao

import androidx.room.*
import androidx.room.ForeignKey.CASCADE

/*@Entity(tableName = "Student",foreignKeys = @ForeignKey(entity = Teacher::class,parentColumns = "id",childColumns = "emp_id",onDelete = CASCADE),
    indices = @Index(value={"emp_id"},unique = true))*/
@Entity(
    foreignKeys = arrayOf(
        ForeignKey(
            entity = Teacher::class,
            parentColumns = arrayOf("t_id"),//主键    通过empid 和t_id 将 两个表关联起来
            childColumns = arrayOf("emp_id")//外键
        )
    )
)
data class Student(
    @PrimaryKey(autoGenerate = true)//主键是否增长
    var studentID: Long?,///定义数据表中的字段名
    @ColumnInfo(name = "emp_id")
    var tempId: Long?,
    @ColumnInfo(name = "s_name")
    var studentName: String?,
    @ColumnInfo(name = "s_type")
    var studentType: String?,
    @Embedded
    val address: Address?

)

data class Address(

    val city: String?,
    @ColumnInfo(name = "post_code")
    val postCode: Int
)
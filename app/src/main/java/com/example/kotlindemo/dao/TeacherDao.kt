package com.example.kotlindemo.dao;

import androidx.room.Dao;
import androidx.room.Insert
import androidx.room.Query

@Dao
interface TeacherDao: BaseDao<Teacher>{
    @Insert
    fun insert(element:Teacher)

    @Query("select * from Teacher")
    fun getAllTeachers():MutableList<Teacher>

    @Query("select * from Teacher where t_id = :teacherID")
    fun getTeacher(teacherID:Int):Teacher

    @Query("select * from Teacher order by t_year desc ")
    fun getAllByDateDesc():MutableList<Teacher>

    @Query("delete from Teacher")
    fun deleteAll()

}

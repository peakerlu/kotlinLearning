package com.example.kotlindemo.dao

import androidx.room.*

@Dao
interface StudentDao : BaseDao<Student> {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insert(element: Student)

    @Query("select * from Student")
    fun getAllStudents(): MutableList<Student>

    @Query("select * from Student where studentID = :studentID")
    fun getStudnet(studentID: Int): Student

    @Query("select * from Student order by studentID desc ")
    fun getAllByDateDesc(): MutableList<Student>

    @Query("delete from Student")
    fun deleteAll()


    @Query("select * from Student where emp_id = :empId")
    fun getStudnetByEmpid(empId: Int): MutableList<Student>



    @Query("SELECT *  from Student INNER JOIN Teacher ON Student.emp_id = Teacher.t_id")
    fun getStudnetByid(): MutableList<InBean>




}
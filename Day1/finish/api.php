<?php

$data = array(
  array('date' => '2012-08-01', 'text' => 'Homework 1', 'categoryId' => 'cat1'),
  array('date' => '2012-08-29', 'text' => 'Homework 2', 'categoryId' => 'cat1'),
  array('date' => '2012-08-03', 'text' => 'Homework 3', 'categoryId' => 'cat1'),
  array('date' => '2012-08-26', 'text' => 'Homework 4', 'categoryId' => 'cat1'),
  array('date' => '2012-08-06', 'text' => 'Homework 5', 'categoryId' => 'cat1'),
  array('date' => '2012-08-20', 'text' => 'Midterm Review', 'categoryId' => 'cat3'),
  array('date' => '2012-08-09', 'text' => 'Reading Assignment', 'categoryId' => 'cat2'),
  array('date' => '2012-08-17', 'text' => 'Midterm Evaluation', 'categoryId' => 'cat4'),
  array('date' => '2012-08-12', 'text' => 'Homework 6', 'categoryId' => 'cat1'),
  array('date' => '2012-08-14', 'text' => 'Homework 7', 'categoryId' => 'cat1'),
  array('date' => '2012-08-15', 'text' => 'Homework 8', 'categoryId' => 'cat1'),
  array('date' => '2012-08-11', 'text' => 'Homework 9', 'categoryId' => 'cat1'),
  array('date' => '2012-08-18', 'text' => 'Homework 10', 'categoryId' => 'cat1'),
  array('date' => '2012-08-08', 'text' => 'Final Exam Review', 'categoryId' => 'cat3')
);

header("Content-Type: application/json");
echo json_encode($data);

?>
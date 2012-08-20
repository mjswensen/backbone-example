<?php

$data = array(
  array('date' => '', 'text' => 'Homework 1', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Homework 2', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Homework 3', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Homework 4', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Homework 5', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Midterm Review', 'categoryId' => 'cat3'),
  array('date' => '', 'text' => 'Reading Assignment', 'categoryId' => 'cat2'),
  array('date' => '', 'text' => 'Midterm Evaluation', 'categoryId' => 'cat4'),
  array('date' => '', 'text' => 'Homework 6', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Homework 7', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Homework 8', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Homework 9', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Homework 10', 'categoryId' => 'cat1'),
  array('date' => '', 'text' => 'Final Exam Review', 'categoryId' => 'cat3')
);

header("Content-Type: application/json");
echo json_encode($data);

?>
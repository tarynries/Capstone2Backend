\echo 'Delete and recreate meal_planning db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE meal_planning_test;
CREATE DATABASE meal_planning_test;
\connect meal_planning_test

\i meal_planning_test_schema.sql
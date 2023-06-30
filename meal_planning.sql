\echo 'Delete and recreate meal_planning db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE meal_planning;
CREATE DATABASE meal_planning;
\connect meal_planning

\i meal_planning_schema.sql
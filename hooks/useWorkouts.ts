import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export interface Workout {
  workout: string;
  calories_per_kg_hour: number;
}

// Define the workouts data inline since we can't use CSV imports on web
const WORKOUTS_DATA = `workout,calories_per_kg_hour
"Aerobics, general",6.505478774771756
"Aerobics, high impact",7.0056515493822
"Aerobics, low impact",5.004841819373553
"Aerobics, step aerobics",8.509352230270599
Archery,3.504510410897045
"Backpacking, Hiking with pack",7.0056515493822
Badminton,4.508225232529823
"Bagging grass, leaves",4.001126997740775
"Ballet, twist, jazz, tap",4.508225232529823
"Ballroom dancing, fast",5.505320140905692
"Ballroom dancing, slow",3.0009683638747107
"Basketball game, competitive",8.008498355291275
"Basketball, officiating",7.0056515493822
"Basketball, shooting baskets",4.508225232529823
"Basketball, wheelchair",6.505478774771756
Bathing dog,3.504510410897045
Billiards,2.5043517770309807
Bird watching,2.5043517770309807
"Boating, power, speed boat",2.5043517770309807
Bowling,3.0009683638747107
"Boxing, in ring",12.00962535303205
"Boxing, punching bag",6.001936727749421
"Boxing, sparring",9.005593263667144
"Calisthenics, light",3.504510410897045
"Calisthenics, vigorous, pushups, situps…",8.008498355291275
"Canoeing, camping trip",4.001126997740775
"Canoeing, rowing, light",3.0009683638747107
"Canoeing, rowing, moderate",7.0056515493822
"Canoeing, rowing, vigorous",12.00962535303205
"Carpentry, general",3.504510410897045
"Carrying 7.3 to 10.9 kg, upstairs",6.001936727749421
"Carrying 11.3 to 22.2 kg, upstairs",8.008498355291275
Carrying heavy loads,8.008498355291275
"Carrying infant, level ground",3.504510410897045
"Carrying infant, upstairs",5.004841819373553
Carrying moderate loads upstairs,8.008498355291275
Carrying small children,3.0009683638747107
"Children's games, hopscotch, dodgeball",5.004841819373553
"Circuit training, minimal rest",8.008498355291275
Cleaning gutters,5.004841819373553
"Cleaning, dusting",2.5043517770309807
"Climbing hills, carrying 4.5 to 9.1 kg",7.509193596404534
"Climbing hills, carrying 9.5 to 19.1 kg",8.008498355291275
"Climbing hills, carrying over 19.1 kg",9.005593263667144
"Climbing hills, carrying up to 4.1 kg",7.0056515493822
"Coaching: football, basketball, soccer…",4.001126997740775
"Crew, sculling, rowing, competition",12.00962535303205
"Cricket (batting, bowling)",5.004841819373553
Croquet,2.5043517770309807
"Cross country skiing, moderate",8.008498355291275
"Cross country skiing, racing",14.010435083040697
"Cross country skiing, uphill",16.514786860071677
"Cross country skiing, vigorous",9.005593263667144
"Cross country snow skiing, slow",7.0056515493822
Curling,4.001126997740775
"Cycling, 10-19.2 km/h, light",6.001936727749421
"Cycling, 12-22.4 km/h, moderate",8.008498355291275
"Cycling, 14-25.6 km/h, vigorous",10.00930808529992
"Cycling, 16-30.6 km/h, very fast, racing",12.00962535303205
"Cycling, <16.1 km/h, leisure bicycling",4.001126997740775
"Cycling, >32.2 km/h, racing",16.014308538539538
"Cycling, mountain bike, bmx",8.509352230270599
Darts (wall or lawn),2.5043517770309807
"Diving, springboard or platform",3.0009683638747107
"Downhill snow skiing, moderate",6.001936727749421
"Downhill snow skiing, racing",8.008498355291275
Fencing,6.001936727749421
"Football or baseball, playing catch",2.5043517770309807
"Football, competitive",9.005593263667144
"Football, touch, flag, general",8.008498355291275
"Frisbee playing, general",3.0009683638747107
"Frisbee, ultimate frisbee",8.008498355291275
"Gardening, general",4.001126997740775
General cleaning,3.504510410897045
General housework,3.504510410897045
"Golf, driving range",3.0009683638747107
"Golf, general",4.508225232529823
"Golf, miniature golf",3.0009683638747107
"Golf, using power cart",3.504510410897045
"Golf, walking and carrying clubs",4.508225232529823
"Golf, walking and pulling clubs",4.304432544018169
Gymnastics,4.001126997740775
Hacky sack,4.001126997740775
Handball,12.00962535303205
"Handball, team",8.008498355291275
Health club exercise,5.505320140905692
"Hiking, cross country",6.001936727749421
"Hockey, field hockey",8.008498355291275
"Hockey, ice hockey",8.008498355291275
"Horesback riding, saddling horse",3.504510410897045
"Horse grooming, moderate",6.001936727749421
"Horse racing, galloping",8.008498355291275
"Horseback riding, grooming horse",3.504510410897045
"Horseback riding, trotting",6.505478774771756
"Horseback riding, walking",2.5043517770309807
Horseshoe pitching,3.0009683638747107
"Ice skating, < 14.5 km/h",5.505320140905692
"Ice skating, average speed",7.0056515493822
"Ice skating, rapidly",9.005593263667144
Instructing aerobic class,6.001936727749421
Jai alai,12.00962535303205
Jazzercise,6.001936727749421
Juggling,4.001126997740775
"Jumping rope, fast",12.00962535303205
"Jumping rope, moderate",10.00930808529992
"Jumping rope, slow",8.008498355291275
Kayaking,5.004841819373553
Kickball,7.0056515493822
Krav maga training,10.00930808529992
Lacrosse,8.008498355291275
"Loading, unloading car",3.0009683638747107
"Marching, rapidly, military",6.505478774771756
"Martial arts, judo, karate, jujitsu",10.00930808529992
"Martial arts, kick boxing",10.00930808529992
"Martial arts, tae kwan do",10.00930808529992
Mild stretching,2.5043517770309807
"Mowing lawn, riding mower",2.5043517770309807
"Mowing lawn, walk, power mower",5.505320140905692
Orienteering,9.005593263667144
Paddle boat,4.001126997740775
"Paddleball, competitive",10.00930808529992
Painting,4.508225232529823
"Playing basketball, non game",6.001936727749421
Playing paddleball,6.001936727749421
Playing racquetball,7.0056515493822
Playing soccer,7.0056515493822
Playing tennis,7.0056515493822
Playing volleyball,3.0009683638747107
Polo,8.008498355291275
Pushing a wheelchair,4.001126997740775
Pushing stroller or walking with children,2.5043517770309807
Race walking,6.505478774771756
"Racquetball, competitive",10.00930808529992
Raking lawn,4.304432544018169
"Riding a horse, general",4.001126997740775
"Riding, snow blower",3.0009683638747107
"Rock climbing, ascending rock",11.009466719165985
"Rock climbing, mountain climbing",8.008498355291275
"Rock climbing, rappelling",8.008498355291275
"Roller blading, in-line skating",12.00962535303205
Roller skating,7.0056515493822
"Rowing machine, light",3.504510410897045
"Rowing machine, moderate",7.0056515493822
"Rowing machine, very vigorous",12.00962535303205
"Rowing machine, vigorous",8.509352230270599
Rugby,10.00930808529992
"Running, 16.1 km/h (6 min mile)",16.014308538539538
"Running, 17.5 km/h (5.5 min mile)",18.015118268548186
"Running, 8.0 km/h (12 minute mile)",8.008498355291275
"Running, 8.4 km/h (11.5 minute mile)",9.005593263667144
"Running, 9.7 km/h (10 min mile)",10.00930808529992
"Running, 10.8 km/h (9 min mile)",11.009466719165985
"Running, 11.3 km/h (8.5 min mile)",11.510320594145309
"Running, 12.1 km/h (8 min mile)",12.514035415778087
"Running, 12.9 km/h (7.5 min mile)",13.511130324153955
"Running, 13.8 km/h (7 min mile)",14.010435083040697
"Running, 14.5 km/h (6.5 min mile)",15.014149904673474
"Running, cross country",9.005593263667144
"Running, general",8.008498355291275
"Running, on a track, team practice",10.00930808529992
"Running, stairs, up",15.014149904673474
"Running, training, pushing wheelchair",8.008498355291275
"Sailing, competition",5.004841819373553
"Sailing, yachting, ocean sailing",3.0009683638747107
Shoveling snow by hand,6.001936727749421
"Shuffleboard, lawn bowling",3.0009683638747107
"Sit, playing with animals",2.5043517770309807
Skateboarding,5.004841819373553
Ski machine,7.0056515493822
Ski mobiling,7.0056515493822
"Skiing, water skiing",6.001936727749421
"Skin diving, fast",16.014308538539538
"Skin diving, moderate",12.514035415778087
"Skin diving, scuba diving",7.0056515493822
Sky diving,3.0009683638747107
"Sledding, tobagganing, luge",7.0056515493822
Snorkeling,5.004841819373553
Snow shoeing,8.008498355291275
"Snow skiing, downhill skiing, light",5.004841819373553
Snowmobiling,3.504510410897045
"Soccer, competitive",10.00930808529992
Softball or baseball,5.004841819373553
"Softball, officiating",4.001126997740775
"Softball, pitching",6.001936727749421
"Speed skating, ice, competitive",15.014149904673474
Squash,12.00962535303205
Stair machine,9.005593263667144
"Standing, playing with children, light",2.802927572896264
"Stationary cycling, light",5.505320140905692
"Stationary cycling, moderate",7.0056515493822
"Stationary cycling, very light",3.0009683638747107
"Stationary cycling, very vigorous",12.514035415778087
"Stationary cycling, vigorous",10.510161960279245
"Stretching, hatha yoga",4.001126997740775
"Surfing, body surfing or board surfing",3.0009683638747107
Swimming backstroke,7.0056515493822
Swimming breaststroke,10.00930808529992
Swimming butterfly,11.009466719165985
"Swimming laps, freestyle, fast",10.00930808529992
"Swimming laps, freestyle, slow",7.0056515493822
"Swimming leisurely, not laps",6.001936727749421
Swimming sidestroke,8.008498355291275
Swimming synchronized,8.008498355291275
"Swimming, treading water, fast, vigorous",10.00930808529992
"Swimming, treading water, moderate",4.001126997740775
"Table tennis, ping pong",4.001126997740775
Tai chi,4.001126997740775
Taking out trash,3.0009683638747107
"Teach physical education,exercise class",4.001126997740775
"Tennis, doubles",6.001936727749421
"Tennis, singles",8.008498355291275
"Track and field (high jump, pole vault)",6.001936727749421
Track and field (hurdles),10.00930808529992
"Track and field (shot, discus)",4.001126997740775
Trampoline,3.504510410897045
Unicycling,5.004841819373553
"Volleyball, beach",8.008498355291275
"Volleyball, competitive",8.008498355291275
"Walk / run, playing with animals",4.001126997740775
"Walk/run, playing with children, moderate",4.001126997740775
"Walk/run, playing with children, vigorous",5.004841819373553
"Walking 3.2 km/h, slow",2.5043517770309807
Walking 4.0 km/h,3.0009683638747107
"Walking 4.8 km/h, moderate",3.303781447875587
"Walking 5.6 km/h, brisk pace",3.803086206762328
"Walking 5.6 km/h, uphill",6.001936727749421
"Walking 6.4 km/h, very brisk",5.004841819373553
Walking 7.2 km/h,6.304749811750298
Walking 8.0 km/h,8.008498355291275
Walking downstairs,3.0009683638747107
Walking the dog,3.0009683638747107
Walking using crutches,5.004841819373553
"Walking, pushing a wheelchair",4.001126997740775
"Walking, snow blower",3.504510410897045
"Walking, under 3.2 km/h, very slow",2.0008097300086467
Wallyball,7.0056515493822
Water aerobics,4.001126997740775
"Water aerobics, water calisthenics",4.001126997740775
Water jogging,8.008498355291275
Water polo,10.00930808529992
Water volleyball,3.0009683638747107
Watering lawn or garden,1.5072568686551127
"Weeding, cultivating garden",4.508225232529823
"Weight lifting, body building, vigorous",6.001936727749421
"Weight lifting, light workout",3.0009683638747107
"Whitewater rafting, kayaking, canoeing",5.004841819373553
"Windsurfing, sailing",3.0009683638747107
Wrestling,6.001936727749421`;

export function useWorkouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    Papa.parse(WORKOUTS_DATA, {
      header: true,
      complete: (results) => {
        const parsedWorkouts = results.data
          .map((workout: any) => ({
            ...workout,
            calories_per_kg_hour: parseFloat(workout.calories_per_kg_hour)
          }))
          .sort((a: Workout, b: Workout) => a.workout.localeCompare(b.workout));
        setWorkouts(parsedWorkouts);
      }
    });
  }, []);

  return workouts;
}
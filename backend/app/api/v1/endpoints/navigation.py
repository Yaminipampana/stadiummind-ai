import math
import heapq
import os
from fastapi import APIRouter, Body
from app.schemas.stadium import POISchema, RouteRequest, StadiumRouteResponse, RouteSegmentSchema

router = APIRouter()

# Mock POIs database matching stadium footprint around Los Angeles coordinates
MOCK_POIS = [
    # Gates
    POISchema(id="gate1", name="Gate 1 North Entrance", type="gate", lat=34.0520, lng=-118.2435, level=1, isAccessible=True, status="open"),
    POISchema(id="gate2", name="Gate 2 East Gate", type="gate", lat=34.0525, lng=-118.2430, level=1, isAccessible=True, status="open"),
    POISchema(id="gate4", name="Gate 4 West Gate", type="gate", lat=34.0515, lng=-118.2444, level=1, isAccessible=False, status="busy"),
    
    # Food Courts / Concessions
    POISchema(id="food1", name="Hot Dog Express Sector A", type="concession", lat=34.0522, lng=-118.2438, level=1, isAccessible=True, status="busy"),
    POISchema(id="food2", name="Pizza & Tacos Corner", type="concession", lat=34.0521, lng=-118.2434, level=2, isAccessible=False, status="open"),
    POISchema(id="food3", name="Central Beverages Plaza", type="concession", lat=34.0523, lng=-118.2441, level=1, isAccessible=True, status="open"),
    
    # Medical Rooms
    POISchema(id="med1", name="First Aid Station 110", type="first-aid", lat=34.0519, lng=-118.2436, level=1, isAccessible=True, status="open"),
    POISchema(id="med2", name="Emergency Trauma Room 204", type="first-aid", lat=34.0528, lng=-118.2437, level=2, isAccessible=True, status="open"),
    
    # Washrooms
    POISchema(id="rest1", name="Washrooms Sector 102 (ADA)", type="restroom", lat=34.0523, lng=-118.2439, level=1, isAccessible=True, status="open"),
    POISchema(id="rest2", name="Washrooms Sector 212", type="restroom", lat=34.0524, lng=-118.2431, level=2, isAccessible=True, status="open"),
    
    # Parking Lots
    POISchema(id="park1", name="North Spectator Parking Lot", type="parking", lat=34.0535, lng=-118.2435, level=1, isAccessible=True, status="open"),
    POISchema(id="park2", name="VIP & Accessibility Parking", type="parking", lat=34.0505, lng=-118.2435, level=1, isAccessible=True, status="open"),
    
    # Entrances & Exits
    POISchema(id="ent1", name="Main VIP Entrance Lobby", type="entrance", lat=34.0511, lng=-118.2439, level=1, isAccessible=True, status="open"),
    POISchema(id="exit1", name="Emergency Exit Sector 4", type="exit", lat=34.0526, lng=-118.2445, level=1, isAccessible=True, status="open"),
    
    # Merchandise Shops
    POISchema(id="shop1", name="FIFA Official Merchandise Megastore", type="shop", lat=34.0516, lng=-118.2433, level=1, isAccessible=True, status="open"),
    POISchema(id="shop2", name="Fan Cap & Scarf Express", type="shop", lat=34.0525, lng=-118.2442, level=2, isAccessible=True, status="open"),
    
    # Elevators
    POISchema(id="elev1", name="Main Elevator West Tower", type="elevator", lat=34.0526, lng=-118.2440, level=1, isAccessible=True, status="open"),
]

# Grid Connection Network (Graph Edges)
EDGES = {
    "gate1": ["food1", "rest1", "elev1", "park1"],
    "gate2": ["food2", "rest2", "shop1"],
    "gate4": ["food3", "exit1", "elev1"],
    "food1": ["gate1", "med1", "rest1"],
    "food2": ["gate2", "rest2", "med2"],
    "food3": ["gate4", "elev1", "exit1"],
    "med1": ["food1", "ent1"],
    "med2": ["food2", "shop2"],
    "rest1": ["gate1", "food1", "elev1"],
    "rest2": ["gate2", "food2", "shop2"],
    "park1": ["gate1", "gate2"],
    "park2": ["ent1", "shop1"],
    "ent1": ["med1", "park2", "shop1"],
    "exit1": ["gate4", "food3"],
    "shop1": ["gate2", "ent1", "park2"],
    "shop2": ["med2", "rest2", "elev1"],
    "elev1": ["gate1", "rest1", "food3", "shop2", "gate4"]
}

def calculate_haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculates geodetic distance in meters using Haversine formula."""
    R = 6371000.0  # Earth's radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    
    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lng / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def compute_shortest_path(source_id: str, dest_id: str, accessible_only: bool = False):
    """Executes Dijkstra's routing algorithms over spatial stadium grids."""
    poi_map = {poi.id: poi for poi in MOCK_POIS}
    if source_id not in poi_map or dest_id not in poi_map:
        return None
        
    dist_map = {source_id: 0.0}
    prev = {}
    queue = [(0.0, source_id)]
    
    while queue:
        dist, curr = heapq.heappop(queue)
        
        if curr == dest_id:
            break
            
        if dist > dist_map.get(curr, float('inf')):
            continue
            
        neighbors = EDGES.get(curr, [])
        for neighbor in neighbors:
            if neighbor not in poi_map:
                continue
            neighbor_poi = poi_map[neighbor]
            
            # Step-free / wheelchair checks
            if accessible_only and not neighbor_poi.isAccessible:
                continue
                
            curr_poi = poi_map[curr]
            seg_dist = calculate_haversine(curr_poi.lat, curr_poi.lng, neighbor_poi.lat, neighbor_poi.lng)
            
            # Elevation Level Transitions Penalty checks
            level_diff = abs(curr_poi.level - neighbor_poi.level)
            if level_diff > 0:
                if curr_poi.type == "elevator" or neighbor_poi.type == "elevator":
                    seg_dist += 15.0  # 15 meter delay penalty equivalent for lifts
                else:
                    if accessible_only:
                        continue  # block stairs routes
                    seg_dist += 45.0  # 45 meter delay penalty equivalent for stairs climbs
                    
            old_dist = dist_map.get(neighbor, float('inf'))
            new_dist = dist + seg_dist
            if new_dist < old_dist:
                dist_map[neighbor] = new_dist
                prev[neighbor] = curr
                heapq.heappush(queue, (new_dist, neighbor))
                
    if dest_id not in dist_map:
        return None
        
    path = []
    curr = dest_id
    while curr is not None:
        path.append(curr)
        curr = prev.get(curr)
    path.reverse()
    
    return path, dist_map[dest_id]

@router.get("/navigation/pois", response_model=list[POISchema])
async def get_pois(type: str | None = None):
    """Returns points of interest matching the category query."""
    if type:
        return [poi for poi in MOCK_POIS if poi.type == type]
    return MOCK_POIS

@router.post("/navigation/route", response_model=StadiumRouteResponse)
async def calculate_route(payload: RouteRequest = Body(...)):
    """Calculates paths between stadium coordinates, avoiding stairs if requested."""
    result = compute_shortest_path(payload.source_id, payload.dest_id, payload.accessible_only)
    
    if not result:
        # Fallback to direct routing segment if graph partition has no path
        poi_map = {poi.id: poi for poi in MOCK_POIS}
        source_poi = poi_map.get(payload.source_id, MOCK_POIS[0])
        dest_poi = poi_map.get(payload.dest_id, MOCK_POIS[1])
        points = [
            RouteSegmentSchema(lat=source_poi.lat, lng=source_poi.lng),
            RouteSegmentSchema(lat=dest_poi.lat, lng=dest_poi.lng)
        ]
        return StadiumRouteResponse(
            sourceId=payload.source_id,
            destId=payload.dest_id,
            points=points,
            distanceMeters=150.0,
            estimatedSeconds=120,
            isAccessibleRoute=payload.accessible_only,
            instructions=["Direct straight corridor routing path only."]
        )
        
    path, distance = result
    poi_map = {poi.id: poi for poi in MOCK_POIS}
    
    # Map coordinates path
    points = [RouteSegmentSchema(lat=poi_map[node_id].lat, lng=poi_map[node_id].lng) for node_id in path]
    
    # Generate instructions
    instructions = []
    for i in range(len(path) - 1):
        step_from = poi_map[path[i]]
        step_to = poi_map[path[i+1]]
        
        action = "head towards"
        if step_to.level > step_from.level:
            via = "elevator" if (step_from.type == "elevator" or step_to.type == "elevator") else "stairs"
            action = f"ascend to Floor {step_to.level} using the {via} to"
        elif step_to.level < step_from.level:
            via = "elevator" if (step_from.type == "elevator" or step_to.type == "elevator") else "stairs"
            action = f"descend to Floor {step_to.level} using the {via} to"
            
        instructions.append(f"From {step_from.name}, {action} {step_to.name}.")
        
    instructions.append("You have arrived at your destination.")
    
    # Estimated time calculation (1.3 m/s walking speed + floor transition penalties)
    estimated_seconds = int(distance / 1.3)
    
    return StadiumRouteResponse(
        sourceId=payload.source_id,
        destId=payload.dest_id,
        points=points,
        distanceMeters=round(distance, 1),
        estimatedSeconds=estimated_seconds,
        isAccessibleRoute=payload.accessible_only,
        instructions=instructions
    )

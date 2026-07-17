import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
  __tablename__ = "users"
  
  id = Column(String, primary_key=True, index=True)
  name = Column(String, nullable=False)
  email = Column(String, unique=True, index=True, nullable=False)
  role = Column(String, default="user") # user, volunteer, admin
  hashed_password = Column(String, nullable=False)
  created_at = Column(DateTime, default=datetime.datetime.utcnow)

  tasks = relationship("VolunteerTask", back_populates="assigned_to")

class ChatMessage(Base):
  __tablename__ = "chat_messages"
  
  id = Column(Integer, primary_key=True, index=True, autoincrement=True)
  session_id = Column(String, index=True, nullable=False)
  role = Column(String, nullable=False) # user, assistant
  content = Column(String, nullable=False)
  timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class POI(Base):
  __tablename__ = "pois"
  
  id = Column(String, primary_key=True, index=True)
  name = Column(String, nullable=False)
  type = Column(String, nullable=False) # gate, concession, restroom, etc.
  lat = Column(Float, nullable=False)
  lng = Column(Float, nullable=False)
  level = Column(Integer, default=1)
  is_accessible = Column(Boolean, default=True)
  status = Column(String, default="open") # open, closed, busy

class QueueMetric(Base):
  __tablename__ = "queue_metrics"
  
  id = Column(Integer, primary_key=True, index=True, autoincrement=True)
  poi_id = Column(String, ForeignKey("pois.id"), nullable=False)
  wait_minutes = Column(Integer, default=0)
  predicted_15min = Column(Integer, default=0)
  predicted_30min = Column(Integer, default=0)
  trend = Column(String, default="stable") # rising, stable, falling
  timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class VolunteerTask(Base):
  __tablename__ = "volunteer_tasks"
  
  id = Column(String, primary_key=True, index=True)
  title = Column(String, nullable=False)
  description = Column(String, nullable=False)
  location_name = Column(String, nullable=False)
  priority = Column(String, default="medium") # low, medium, high, critical
  status = Column(String, default="pending") # pending, in-progress, completed
  assigned_to_id = Column(String, ForeignKey("users.id"), nullable=True)
  created_at = Column(DateTime, default=datetime.datetime.utcnow)
  updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

  assigned_to = relationship("User", back_populates="tasks")

class WheelchairRequest(Base):
  __tablename__ = "wheelchair_requests"
  
  id = Column(String, primary_key=True, index=True)
  user_location = Column(String, nullable=False)
  user_phone = Column(String, nullable=False)
  status = Column(String, default="requested") # requested, dispatched, completed
  assigned_volunteer_id = Column(String, ForeignKey("users.id"), nullable=True)
  created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SustainabilityLog(Base):
  __tablename__ = "sustainability_logs"
  
  id = Column(String, primary_key=True, index=True)
  user_id = Column(String, nullable=False)
  item_type = Column(String, nullable=False) # bottle, can, cardboard
  count = Column(Integer, default=1)
  points_credited = Column(Integer, default=0)
  timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class SOSSignal(Base):
  __tablename__ = "sos_signals"
  
  id = Column(String, primary_key=True, index=True)
  type = Column(String, nullable=False) # medical, security, fire, structural
  location_desc = Column(String, nullable=False)
  contact_phone = Column(String, nullable=True)
  status = Column(String, default="active") # active, resolved
  created_at = Column(DateTime, default=datetime.datetime.utcnow)

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Todo, Organization

bp = Blueprint('api', __name__)

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    org = Organization.query.filter_by(name=data['organization']).first()
    if not org:
        org = Organization(name=data['organization'])
        db.session.add(org)
        db.session.commit()

    user = User(username=data['username'], organization_id=org.id)
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify(msg="User registered"), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.check_password(data['password']):
        token = create_access_token(identity=str(user.id))
        return jsonify(access_token=token)
    return jsonify(msg="Invalid credentials"), 401

@bp.route('/todos', methods=['GET'])
@jwt_required()
def get_todos():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    todos = Todo.query.filter_by(organization_id=user.organization_id).all()
    return jsonify([{'id': t.id, 'content': t.content, 'user_id': t.user_id} for t in todos])

@bp.route('/todos', methods=['POST'])
@jwt_required()
def create_todo():
    data = request.get_json()
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    todo = Todo(content=data['content'], user_id=user.id, organization_id=user.organization_id)
    db.session.add(todo)
    db.session.commit()
    return jsonify(id=todo.id, content=todo.content), 201

@bp.route('/todos/<int:todo_id>', methods=['PUT'])
@jwt_required()
def update_todo(todo_id):
    user_id = int(get_jwt_identity())
    todo = Todo.query.get_or_404(todo_id)
    if todo.user_id != user_id:
        return jsonify(msg="Not authorized"), 403
    data = request.get_json()
    todo.content = data['content']
    db.session.commit()
    return jsonify(msg="Todo updated")

@bp.route('/todos/<int:todo_id>', methods=['DELETE'])
@jwt_required()
def delete_todo(todo_id):
    user_id = int(get_jwt_identity())
    todo = Todo.query.get_or_404(todo_id)
    if todo.user_id != user_id:
        return jsonify(msg="Not authorized"), 403
    db.session.delete(todo)
    db.session.commit()
    return jsonify(msg="Todo deleted")

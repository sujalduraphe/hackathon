import { supabaseAdmin } from '../config/supabase.js';

/**
 * GET /api/notifications
 * Get notifications for logged-in user.
 * Query: ?read=false&type=application_shortlisted&limit=20
 */
export async function getNotifications(req, res) {
  try {
    const userId = req.user.id;
    const { read, type, limit = 20 } = req.query;

    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(Number(limit));

    if (read !== undefined) query = query.eq('read', read === 'true');
    if (type) query = query.eq('type', type);

    const { data: notifications, error } = await query;
    if (error) throw error;

    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    return res.json({ notifications: notifications || [], unreadCount });
  } catch (err) {
    console.error('[getNotifications]', err);
    return res.status(500).json({ error: 'Failed to fetch notifications' });
  }
}

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read.
 */
export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId) // ensure ownership
      .select()
      .single();

    if (error || !data) return res.status(404).json({ error: 'Notification not found' });

    return res.json({ message: 'Marked as read', notification: data });
  } catch (err) {
    console.error('[markAsRead]', err);
    return res.status(500).json({ error: 'Failed to mark notification as read' });
  }
}

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read.
 */
export async function markAllAsRead(req, res) {
  try {
    const userId = req.user.id;

    await supabaseAdmin
      .from('notifications')
      .update({ read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('read', false);

    return res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('[markAllAsRead]', err);
    return res.status(500).json({ error: 'Failed to mark all as read' });
  }
}

/**
 * DELETE /api/notifications/:id
 */
export async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    return res.json({ message: 'Notification deleted' });
  } catch (err) {
    console.error('[deleteNotification]', err);
    return res.status(500).json({ error: 'Failed to delete notification' });
  }
}

/**
 * POST /api/notifications
 * Create a notification (admin/system use).
 * Body: { userId, type, message, metadata? }
 * Access: institution or system
 */
export async function createNotification(req, res) {
  try {
    const { userId, type, message, metadata } = req.body;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        message,
        metadata: metadata || {},
        read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ notification: data });
  } catch (err) {
    console.error('[createNotification]', err);
    return res.status(500).json({ error: 'Failed to create notification' });
  }
}

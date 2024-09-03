package com.okmindmap.web.spring;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.model.MapTimeline;
import com.okmindmap.model.User;
import com.okmindmap.service.MindmapService;

public class TimelineViewAction extends BaseAction {

	private MindmapService mindmapService;

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
//		String mapId = request.getParameter("id");
		String mapKey = request.getParameter("key");
		
		boolean isOwner= false;
		
		User user = getUser(request);
		if(user == null || user.getUsername().equals("guest")) {
			String persistent = getPersistentCookie(request);
			if(persistent != null) {
				User user2 = this.userService.loginFromPersistent(request, response, persistent);
				if(user2 != null) {
					user = user2;
				}
			}
		}
		
		Map map =  this.mindmapService.getMapInfo(mapKey);
		List<MapTimeline> timelines = this.mindmapService.getMapTimelines(map.getId());
		
		if( map != null) {
			User owner = this.mindmapService.getMapOwner(map.getId());
			if( owner.getUsername().equals(user.getUsername())) {
				if(!owner.getUsername().equalsIgnoreCase("guest")){
					isOwner = true;
				}
			}
		}
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		data.put("map", map);
		data.put("mapId", Integer.toString(map.getId()));
		data.put("timelines", timelines);
		data.put("isOwner", isOwner);
		
		// Mobile 식별을 위한 값
		String userAgent = request.getHeader("user-agent");
		if(userAgent.indexOf("iPhone") != -1 || userAgent.indexOf("iPod") != -1){
			data.put("mobile", "iPhone");
		}else if(userAgent.indexOf("iPad") != -1){
			data.put("mobile", "iPad");
		}else if(userAgent.indexOf("Android") != -1){
			data.put("mobile", "Android");
		}
		
		return new ModelAndView("timeline", "data", data);
	}
}
